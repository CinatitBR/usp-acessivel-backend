import { Hono } from 'hono';
import { processAndCreateVisualRoute } from '../services/visualRoutes';
import { StepMetadataInput } from '../models/visualRoutes';

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
};
const allowedMimeTypes = ['image/jpeg', 'image/webp'];

const visualRoutes = new Hono<{ Bindings: Bindings }>();

visualRoutes.post('/', async (c) => {
  try {
    const formData = await c.req.formData();

    // Extraindo os dados enviados
    const title = formData.get('title') as string;
    const buildingId = formData.get('buildingId') as string;
    let destinationPoiId = formData.get('destinationPoiId') as string | null;
    let originName = formData.get('originName') as string | null;
    let createdBy = formData.get('createdBy') as string | null;
    const stepsMetaString = formData.get('stepsMeta') as string;

    if (!stepsMetaString) {
      return c.json({ error: 'O campo stepsMeta é obrigatório.' }, 400);
    } else if (!buildingId) {
      return c.json({ error: 'O campo buildingId é obrigatório.' }, 400);
    } else if (!title) {
      return c.json({ error: 'O campo title é obrigatório.' }, 400);
    }

    const stepsMeta: StepMetadataInput[] = JSON.parse(stepsMetaString);
    const imageFiles = formData.getAll('images') as File[];

    if (stepsMeta.length != imageFiles.length) {
      return c.json({ error: `Inconsistência: Você enviou ${stepsMeta.length} passos, mas há ${imageFiles.length} imagens` }, 400);
    }

    // Checa se imagens são do tipo permitido
    for (const img of imageFiles) {
      if (!allowedMimeTypes.includes(img.type)) {
        return c.json({ error: 'Uma ou mais imagens não são do tipo permitido: jpeg ou webp.' }, 400);
      }
    }

    if (destinationPoiId === '' || destinationPoiId === 'null') {
      destinationPoiId = null;
    }

    if (originName === '' || originName === 'null') {
      originName = null;
    }

    if (createdBy === '' || createdBy === 'null') {
      createdBy = null;
    }

    // Montando o objeto para mandar para o service
    const routeInput = { buildingId, title, destinationPoiId, originName, createdBy };
    const routeId = await processAndCreateVisualRoute(c.env.DB, c.env.BUCKET, routeInput, stepsMeta, imageFiles);

    return c.json(
      {
        success: true,
        routeId: routeId,
      },
      201,
    );
  } catch (error) {
    console.error('Erro no Controller ao criar rota:', error);
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }

    return c.json({ error: 'ERR_INTERNAL_SERVER_ERROR' }, 500);
  }
});

export default visualRoutes;
