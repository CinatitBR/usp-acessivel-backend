import { VisualRoute, VisualRouteStep, StepMetadataInput } from '../models/visualRoutes';
import { drizzle } from 'drizzle-orm/d1';
import { visualRoutes, visualRouteSteps } from '../db/schema';
import { inArray } from 'drizzle-orm';

export const createVisualRouteRepo = async (db: D1Database, route: VisualRoute, steps: VisualRouteStep[]): Promise<void> => {
  const d1 = drizzle(db);

  await d1.batch([
    d1.insert(visualRoutes).values({
      id: route.id,
      buildingId: route.buildingId,
      title: route.title,
      destinationPoiId: route.destination_poi_id,
      originName: route.origin_name,
      status: 'pending_moderation',
      createdBy: route.created_by,
    }),
    ...steps.map((step) =>
      d1.insert(visualRouteSteps).values({
        id: step.id,
        visualRouteId: step.visual_route_id,
        stepOrder: step.step_order,
        description: step.description,
        imageUrl: step.image_url,
      }),
    ),
  ]);
};

export const getVisualRoutes = async (db: D1Database, limit: number, offset: number) => {
  const d1 = drizzle(db);

  const routes = await d1.select().from(visualRoutes).limit(limit).offset(offset);

  if (routes.length === 0) {
    return [];
  }

  const routeIds = routes.map(r => r.id);

  const steps = await d1
    .select({
      id: visualRouteSteps.id,
      visualRouteId: visualRouteSteps.visualRouteId,
      stepOrder: visualRouteSteps.stepOrder,
      description: visualRouteSteps.description,
      imageUrl: visualRouteSteps.imageUrl,
      lat: visualRouteSteps.lat,
      lon: visualRouteSteps.lon,
    })
    .from(visualRouteSteps)
    .where(inArray(visualRouteSteps.visualRouteId, routeIds))
    .orderBy(visualRouteSteps.stepOrder);

  return routes.map(route => {
    return {
      ...route,
      steps: steps.filter(step => step.visualRouteId === route.id).map(step => ({
        id: step.id,
        stepOrder: step.stepOrder,
        description: step.description,
        imageUrl: step.imageUrl,
        lat: step.lat,
        lon: step.lon,
      })),
    };
  });
};
