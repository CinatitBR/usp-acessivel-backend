import { Hono } from "hono";
import { postPoiService } from "../services/pois";
import { PostPoiRequest } from "../models/pois";




const poisRoutes = new Hono<{Bindings: {DB: D1Database, BUCKET:R2Bucket} }>()

poisRoutes.post('/', async (c) => {
    const db = c.env.DB;
    const bucket = c.env.BUCKET;
    const mimeTypesAllowed = ['image/jpeg', 'image/webp']
    const request = await c.req.formData();

    const buildingId = request.get('buildingId') as string | null;
    const category = request.get('category') as 'elevator' | 'bathroom' | 'ramp' | 'bus' | 'other';
    const name = request.get('name') as string;
    const latString = request.get('lat') as string;
    const lat = Number(latString);
    const lonString = request.get('lon') as string;
    const lon = Number(lonString);
    const detailsJson = request.get('detailsJson') as string | null;
    const createdBy = request.get('createdBy') as string | null;
    const image = request.get('image') as File | null;

    if(image && !mimeTypesAllowed.includes(image.type)){
        return c.json({
            success: false,
            error: {
                code:'ERR_INVALID_FILE_TYPE',
                message: 'Formato de imagem não permitido. Use JPEG ou WEBP.'
            }
        }, 400);
    }

    const requestPayload: PostPoiRequest = {
        buildingId,
        category,
        name,
        lat,
        lon,
        detailsJson,
        createdBy,
        image
}



    try {
        const newPoi = await postPoiService(db, bucket, requestPayload)
        return c.json( {
            success: true,
            data: newPoi

        }, 201
        )
    }
    catch(error) {
    
        if (error instanceof Error){
            if (error.message.startsWith('ERR_')) {
                return c.json ({
                    success: false,
                    error: {
                      code: error.message,
                      message: 'Falha ao cadastrar ponto de interesse:'

                    }
                }, 500)
            }

            return c.json({
                success: false,
                error: {
                    code: 'ERR_UNKNOWN',
                    message: error.message
                }
            }, 500)

        }

    }

}) 

export default poisRoutes;