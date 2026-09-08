import { Hono } from 'hono';
import { postMapReportService } from '../services/mapReports';
import { postMapReportRequest } from '../models/mapReports';

type ReportTypeEnum =
  | 'blocked_crosswalk'
  | 'pothole'
  | 'broken_elevator'
  | 'fallen_tree'
  | 'inaccessible_entrance'
  | 'irregular_surface'
  | 'sidewalk_surface'
  | 'other';
type GeomTypeEnum = 'point' | 'line';

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
};

const mimeTypesAllowed = ['image/jpeg', 'image/webp'];

export const mapReportsRoutes = new Hono<{ Bindings: Bindings }>();

mapReportsRoutes.post('/', async (c) => {
  const request = await c.req.formData();

  // Extraindo os dados do formData
  const userId = request.get('userId') as string | null;
  const poiId = request.get('poiId') as string | null;
  const reportType = request.get('reportType') as ReportTypeEnum;
  const geomType = request.get('geomType') as GeomTypeEnum;
  const geometryJson = request.get('geometryJson') as string | null;
  const detailsJson = request.get('detailsJson') as string | null;

  const latString = request.get('lat');
  const lonString = request.get('lon');

  const lat = Number(latString);
  const lon = Number(lonString);

  const image = request.get('image') as File | null;

  if (image && !mimeTypesAllowed.includes(image.type)) {
    return c.json(
      {
        success: false,
        error: {
          code: 'ERR_INVALID_FILE_TYPE',
          message: 'Formato de imagem não permitido. Use JPEG ou WEBP.',
        },
      },
      400,
    );
  }

  const requestPayload: postMapReportRequest = {
    userId,
    poiId,
    reportType,
    geomType,
    lat,
    lon,
    geometryJson,
    detailsJson,
    image,
  };

  try {
    const newMapReport = await postMapReportService(c.env.DB, c.env.BUCKET, requestPayload);
    return c.json(
      {
        success: true,
        data: newMapReport,
      },
      201,
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith('ERR_')) {
        return c.json(
          {
            success: false,
            error: {
              code: error.message,
              message: 'Falha ao criar map report',
            },
          },
          500,
        );
      }

      return c.json(
        {
          success: false,
          error: {
            code: 'ERR_UNKNOWN',
            message: error.message,
          },
        },
        500,
      );
    }

    return c.json(
      {
        success: false,
        error: {
          code: 'ERR_INTERNAL',
          message: 'Erro interno inesperado do servidor',
        },
      },
      500,
    );
  }
});

export default mapReportsRoutes;
