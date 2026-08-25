import { Hono } from "hono";
import {getBuildingsList } from '../services/buildings';

const buildings = new Hono<{Bindings: {DB: D1Database}}>();

buildings.get('/', async (c) => {
    
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
export default buildings;