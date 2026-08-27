import type {VisualRoute, VisualRouteStep, StepMetadataInput} from '../models/visualRoutes';
import { createVisualRouteRepo } from '../repositories/visualRoutes';

// Função que o controller vai chamar
 
export const processAndCreateVisualRoute = async (
    db: D1Database,
    bucket: R2Bucket,
    routeInput: {destinationPoiId: string | null; originName: string | null; createdBy: string | null},
    stepsMeta: StepMetadataInput[],
    imageFiles: File[]
    
    ): Promise<string> => {
        
        // Lista das imagens que já subiram, caso precise desfazer
        const uploadedKeys: string[] = [];
        const routeId = `route_${crypto.randomUUID()}`;
        const preparedSteps: VisualRouteStep[] = [];

        try {

            // Upload para o R2, em paralelo
            await Promise.all(
                stepsMeta.map(async (step, index): Promise<void> => {
                    const file = imageFiles[index];
                    const stepId = `step_${crypto.randomUUID()}`;
                    
                    // Cria o nome do arquivo, conforme a arquitetura definida
                    const storageKey = `visual_routes/${routeId}_step_${step.step_order}.webp`;

                    const buffer = await file.arrayBuffer();
                    
                    await bucket.put(storageKey, buffer, {
                        httpMetadata: {
                            contentType: file.type
                        }
                    });

                    uploadedKeys.push(storageKey);

                    preparedSteps.push({
                        id: stepId,
                        visual_route_id: routeId,
                        step_order: step.step_order,
                        description: step.description,
                        image_url: storageKey

                    });
                })
         
            )

            // Atualizar as tabelas de visual routes
            const visualRoute: VisualRoute = {
                id: routeId,
                destination_poi_id: routeInput.destinationPoiId,
                origin_name: routeInput.originName,
                created_by: routeInput.createdBy,
            };

            await createVisualRouteRepo(db, visualRoute, preparedSteps);

            return routeId

        } catch (error) {
            console.error('Falha ao processar Rota Visual. Iniciando Rollback no R2...', error);
            if(uploadedKeys.length > 0) {
                await Promise.allSettled(uploadedKeys.map((key) => bucket.delete(key)));
            }

            throw new Error('ERR_CREATE_VISUAL_ROUTE_FAILED');
        }


    };