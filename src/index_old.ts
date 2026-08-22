/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// import { D1Database, R2Bucket, D1PreparedStatement, Request } from '@cloudflare/workers-types';

export interface Env {
	DB: D1Database;
	BUCKET: R2Bucket;
}

export interface StepMetadataInput {
	step_order: number;
	description: string | null;
	lon: number | null;
	lat: number | null;
}

interface PreparedStepUpload {
	imageId: string;
	stepId: string;
	storageKey: string;
	contentType: string;
	buffer: ArrayBuffer;
	stepOrder: number;
	description: string | null;
	lon: number | null;
	lat: number | null;
}

export default {
	async fetch(request: Request, env: Env) {
		const url = new URL(request.url);

		// CORS preflight handling
		if (request.method === 'OPTIONS') {
			return handleCors();
		}

		// Route: POST /api/visual-route
		if (request.method === 'POST' && url.pathname === '/api/visual-route') {
			return handleCreateVisualRoute(request, env);
		}

		return new Response(JSON.stringify({ error: 'Not Found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json', ...corsHeaders },
		});
	},
};

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

function handleCors() {
	return new Response(null, { headers: corsHeaders });
}

function jsonResponse(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json',
			...corsHeaders,
		},
	});
}

// Returns true if data is of type StepMetadataInput[], and false otherwise.
function isStepMetadataArray(data: any): data is StepMetadataInput[] {
	// data must be an array, and every item in data must be a StepMetadataInput.

	if (!Array.isArray(data)) return false;

	return data.every((item) => {
		return (
			item !== null &&
			typeof item === 'object' &&
			typeof item.step_order === 'number' &&
			typeof item.description === 'string' &&
			(item.lon === null || typeof item.lon === 'number') &&
			(item.lat === null || typeof item.lat === 'number')
		);
	});
}

/*
  -- Expected FormData fields: --
    'FIELD_NAME': FINAL_TYPE

    'title': string

    'building-id': string

    'status': 'published' || 'hidden'

    'steps_metadata': {
      step_order: number;
      description: string;
      lon: number;
      lat: number;
    }[]

    'step_image_i': Blob. (represents the image associated to steps_metadata[i])

   -- Example: -- 
    FormData(7) {
      'title' => 'Entrada Acessível ao Elevador',
      'building_id' => 'fousp',
      'status' => 'published',
      'steps_metadata' => '[{"step_order":0,"description":"Entre pela porta principal","lon":46.738286111111115,"lat":23.566875},{"step_order":1,"description":"Siga em direção às catracas","lon":46.73833055555556,"lat":23.56695277777778},{"step_order":2,"description":"Passe pelas catracas","lon":46.73836111111111,"lat":23.567041666666665}]',
      'step_image_0' => File {
        name: 'IMG_2201.webp',
        lastModified: 1786826281586,
        size: 157242,
        type: 'image/webp'
      },
      'step_image_1' => File {
        name: 'IMG_2202.webp',
        lastModified: 1786826281586,
        size: 115112,
        type: 'image/webp'
      },
      'step_image_2' => File {
        name: 'IMG_2203.webp',
        lastModified: 1786826281586,
        size: 151522,
        type: 'image/webp'
      }
    }
*/
async function handleCreateVisualRoute(request: Request, env: Env): Promise<Response> {
	const uploadedKeys: string[] = []; // Tracks R2 keys for rollback cleanup

	try {
		const formData = await request.formData();

		const title = formData.get('title') as string | null;
		const buildingId = formData.get('building_id') as string | null;
		const status = formData.get('status') as string | null;
		const stepsMetaRaw = formData.get('steps_metadata') as string | null;

		if (!title?.trim() || !buildingId?.trim() || !stepsMetaRaw) {
			return jsonResponse(
				{
					error: 'Missing required fields (title, building_id, status, steps_metadata).',
				},
				400,
			);
		}

		const stepsMeta: StepMetadataInput[] = JSON.parse(stepsMetaRaw);
		if (!isStepMetadataArray(stepsMeta)) {
			return jsonResponse({ error: 'The provided visual steps are not valid.' }, 400);
		}

		const routeId = `route_${crypto.randomUUID()}`;
		const preparedSteps: PreparedStepUpload[] = [];

		// =========================================================================
		// PHASE 1: VALIDATION & PREPARATION (Zero I/O side effects)
		// =========================================================================
		for (let i = 0; i < stepsMeta.length; i++) {
			const step = stepsMeta[i];
			const file = formData.get(`step_image_${i}`);

			// Verify matching file presence
			if (!file || !(file instanceof File) || file.type !== 'image/webp') {
				return jsonResponse({ error: `Missing or invalid image file for step #${i + 1}` }, 400);
			}

			if (file.size === 0) {
				return jsonResponse({ error: `Empty image file received for step #${i + 1}` }, 400);
			}

			const imageId = `img_${crypto.randomUUID()}`;
			const stepId = `step_${crypto.randomUUID()}`;
			const extension = 'webp';
			const storageKey = `routes/${routeId}/${imageId}.${extension}`;
			const buffer = await file.arrayBuffer();
			const lon = step.lon !== null ? Math.round(step.lon * 1e6) / 1e6 : null;
			const lat = step.lat !== null ? Math.round(step.lat * 1e6) / 1e6 : null;

			preparedSteps.push({
				imageId,
				stepId,
				storageKey,
				contentType: `image/${extension}`,
				buffer,
				stepOrder: step.step_order,
				description: step.description,
				lon,
				lat,
			});
		}

		// =========================================================================
		// PHASE 2: PARALLEL R2 UPLOADS (High throughput)
		// =========================================================================
		await Promise.all(
			preparedSteps.map(async (step) => {
				await env.BUCKET.put(step.storageKey, step.buffer, {
					httpMetadata: { contentType: step.contentType },
				});
				uploadedKeys.push(step.storageKey);
			}),
		);

		// =========================================================================
		// PHASE 3: ATOMIC D1 TRANSACTION
		// =========================================================================
		const d1Statements: D1PreparedStatement[] = [
			env.DB.prepare(
				`INSERT INTO visual_route (id, building_id, title, status, created_at)
         VALUES (?, ?, ?, ?, datetime('now'))`,
			).bind(routeId, buildingId, title, status),
		];

		for (const step of preparedSteps) {
			d1Statements.push(
				env.DB.prepare(
					`INSERT INTO image_metadata (id, storage_key, lon, lat, created_at)
           VALUES (?, ?, ?, ?, datetime('now'))`,
				).bind(step.imageId, step.storageKey, step.lon, step.lat),
			);

			d1Statements.push(
				env.DB.prepare(
					`INSERT INTO visual_route_step (id, visual_route_id, step_order, image_id, description, created_at)
           VALUES (?, ?, ?, ?, ?, datetime('now'))`,
				).bind(step.stepId, routeId, step.stepOrder, step.imageId, step.description),
			);
		}

		await env.DB.batch(d1Statements);

		return jsonResponse(
			{
				success: true,
				data: {
					route_id: routeId,
					title,
					building_id: buildingId,
					steps_count: preparedSteps.length,
				},
			},
			201,
		);
	} catch (error) {
		console.error('Failed to create visual route:', error);

		// Rollback: Clean up any R2 files uploaded prior to the failure
		if (uploadedKeys.length > 0) {
			await Promise.allSettled(uploadedKeys.map((key) => env.BUCKET.delete(key)));
		}

		const details = error instanceof Error ? error.message : String(error);
		return jsonResponse({ error: 'Failed to create visual route', details }, 500);
	}
}
