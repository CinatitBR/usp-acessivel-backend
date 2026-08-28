import { VisualRoute, VisualRouteStep, StepMetadataInput } from "../models/visualRoutes";
import { drizzle } from 'drizzle-orm/d1';
import { visualRoutes, visualRouteSteps } from '../db/schema';
import { sql } from 'drizzle-orm';

export const createVisualRouteRepo = async (
    db: D1Database,
    route: VisualRoute,
    steps: VisualRouteStep[]

): Promise<void> => {
    const d1 = drizzle(db);

    await d1.batch([
        d1.insert(visualRoutes).values({
            id: route.id,
            destinationPoiId: route.destination_poi_id,
            originName: route.origin_name,
            status: 'pending_moderation',
            createdBy: route.created_by,
        }),
        ...steps.map(step =>
            d1.insert(visualRouteSteps).values({
                id: step.id,
                visualRouteId: step.visual_route_id,
                stepOrder: step.step_order,
                description: step.description,
                imageUrl: step.image_url,
            })
        )
    ]);
};