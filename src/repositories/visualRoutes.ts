import { VisualRoute, VisualRouteStep } from '../models/visualRoutes';
import { drizzle } from 'drizzle-orm/d1';
import { visualRoutes, visualRouteSteps } from '../db/schema';

export const createVisualRouteRepo = async (db: D1Database, route: VisualRoute, steps: VisualRouteStep[]): Promise<void> => {
  const d1 = drizzle(db);

  await d1.batch([
    d1.insert(visualRoutes).values({
      id: route.id,
      buildingId: route.buildingId,
      title: route.title,
      destinationPoiId: route.destinationPoiId,
      originName: route.originName,
      status: 'pending_moderation',
      createdBy: route.createdBy,
    }),
    ...steps.map((step) =>
      d1.insert(visualRouteSteps).values({
        id: step.id,
        visualRouteId: step.visualRouteId,
        stepOrder: step.stepOrder,
        description: step.description,
        imageUrl: step.imageUrl,
      }),
    ),
  ]);
};
