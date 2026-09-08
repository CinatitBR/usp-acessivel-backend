import { postMapReportRequest } from "../models/mapReports"
import { postMapReport } from "../models/mapReports"
import { postMapReportRepo } from "../repositories/mapReports"


export const postMapReportService = async (db: D1Database, bucket: R2Bucket, request: postMapReportRequest) => {
    const reportId = `rep_${crypto.randomUUID()}`;
    let fileName: string | null = null;
   

    try {

         // Envio de imagem, se houver, para o R2
         if(request.image && request.image instanceof File) {
            const fileExtension = request.image.type.split('/').pop();
            fileName = `${reportId}.${fileExtension}`;

            await bucket.put(fileName, request.image);
         }

        // Criação de um novo registro na tabela mapReports no D1
        const {image, ...data} = request
        const newMapReport: postMapReport = { 
            ...data,
            id: reportId,
            imageUrl: fileName
        };

        await postMapReportRepo(db, newMapReport);
        return newMapReport


    } catch(error) {
        console.error('Falha ao processar map report:', error);

        if(fileName) {
            try {

                console.error(`Iniciando rollback: apagando imagem: ${fileName} do R2`);
              await bucket.delete(fileName);

            } catch(rollbackError) {
                console.error('Falha crítica no rollback do R2:', rollbackError);
            }
        }

        throw new Error('ERR_CREATE_REPORT_FAILED');
    }
}
