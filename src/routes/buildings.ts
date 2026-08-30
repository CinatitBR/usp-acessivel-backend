import { Hono } from "hono";
import {getBuildingsList,getBuildingAccessibilityService } from '../services/buildings';

const buildingRoutes = new Hono<{Bindings: {DB: D1Database}}>();

buildingRoutes.get('/', async (c) => {
    
    try {
        const db = c.env.DB;

    // Chama o service
    const buildingsList = await getBuildingsList(db);
    
    // Se for bem sucedido, retorna a resposta pedida
    return c.json({
        success: true,
        data: buildingsList,
        
    }, 200);


    }
    catch (error: any) {
        if (error.message === 'ERR_FETCH_BUILDINGS_FAILED') {
            return c.json({
                success: false,
                error: {
                    code: 'ERR_FETCH_BUILDINGS_FAILED',
                    message: 'Não foi possível carregar a lista de prédios.'
                }
            }, 500);
        }

        return c.json({sucess: false, message: 'Erro desconhecido'}, 500);

    }

});


buildingRoutes.get('/:id/accessibility', async (c) => {
    const buildingId = c.req.param('id');

    try
    {
        const response = await getBuildingAccessibilityService(c.env.DB, buildingId);

        return c.json( {
            success: true,
            data: response
        }, 200);

    } catch(error){
        const errorMessage = error instanceof Error ? error.message : 'ERR_UNKNOWN';
        
        switch(errorMessage){
            case 'ERR_MISSING_BUILDING_ID':
                return c.json({
                    success: false,
                    error: {
                        code: 'ERR_MISSING_BUILDING_ID',
                        message: 'O ID do prédio é obrigatório na URL.'
                    }
                }, 400);
            
            case 'ERR_BUILDING_NOT_FOUND':
                return c.json({
                    success: false,
                    error: {
                        code: 'ERR_BUILDING_NOT_FOUND',
                        message: 'Predio nao encontrado'
                    }

                }, 404);
            
            case 'ERR_FETCH_ACCESSIBILITY_FAILED':
                default:
                    return c.json({
                        success: false,
                        error: {
                            code: errorMessage === 'ERR_FETCH_ACCESSIBILITY_FAILED' ? errorMessage: 'ERR_UNKNOWN',
                            message: 'Erro interno ao processar a requisição.'
                        }
                    }, 500);

            
            
        }
    }

})

export default buildingRoutes;