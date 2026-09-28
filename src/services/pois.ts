import { postPoiRepo } from "../repositories/pois";
import { InsertPoi } from "../models/pois";
import { PostPoiRequest } from "../models/pois";

export const postPoiService = async (db: D1Database, bucket: R2Bucket, request: PostPoiRequest) => {


    let fileName: string | null  = null;
    const poiId: string = crypto.randomUUID();

    try{
        if(request.image && request.image instanceof File) {
            const fileExtension = request.image.type.split('/').pop()
            fileName = `${request.category}_${poiId}.${fileExtension}`
            await bucket.put(fileName, request.image)
        }

        const {image, ...poiData} = request

        const newPoi: InsertPoi = {
        ...poiData,
        id: poiId,
        imageUrl: fileName
    }
    await postPoiRepo(db, newPoi);
    return newPoi

    } catch(error) {

        if(fileName){
            try {

                console.error(`Iniciando rollback da imagem ${fileName}`)
                await bucket.delete(fileName)
                

            } catch (rollbackError) {
                console.error(`Erro no rollback da imagem ${fileName}`, rollbackError)
            }
        }

        console.error('Falha ao cadastrar ponto de interesse', error)
        throw new Error('ERR_CREATE_POI_FAILED');
    }
}