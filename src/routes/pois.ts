import { Hono } from "hono";
import { postPoiService } from "../services/pois";

const poisRoutes = new Hono<{Bindings: {DB: D1Database} }>()

poisRoutes.post('/', async (c) => {
    const db = c.env.DB;
    const request = await c.req.json()

    try {
        const newPoi = await postPoiService(db, request)
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