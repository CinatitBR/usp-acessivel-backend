import { VisualRoute, VisualRouteStep, StepMetadataInput } from "../models/visualRoutes";

export const createVisualRouteRepo = async (
    db: D1Database,
    route: VisualRoute,
    steps: VisualRouteStep[]

): Promise<void> => {

    const statements = [
        db.prepare(
            `INSERT INTO visual_routes (id, destination_poi_id, origin_name, status, created_by, created_at)
            VALUES (?, ?, ?, 'pending_moderation', ?, datetime('now'))`
        ).bind(route.id, route.destination_poi_id, route.origin_name, route.created_by)
    ];

    for (const step of steps) {
        statements.push(
            db.prepare(
                `INSERT INTO visual_route_steps(id, visual_route_id, step_order, description, image_url)
                VALUES (?, ?, ?, ?, ?)`
            ).bind(step.id, step.visual_route_id, step.step_order, step.description, step.image_url)
        );
    }
    await db.batch(statements);
};