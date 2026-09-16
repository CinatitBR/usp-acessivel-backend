import { postPoiRepo } from "../repositories/pois";
import { InsertPoi } from "../models/pois";
import { PostPoiRequest } from "../models/pois";

export const postPoiService = async (db: D1Database, request: PostPoiRequest) => {
    const newPoi: InsertPoi = {
        ...request,
        id: crypto.randomUUID(),
    }

    try{
    await postPoiRepo(db, newPoi);
    return newPoi
    } catch(error) {
        console.error('Falha ao cadastrar ponto de interesse', error)
        throw new Error('ERR_CREATE_POI_FAILED');
    }
}