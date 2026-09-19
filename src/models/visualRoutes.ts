import { InferSelectModel } from 'drizzle-orm';
import { visualRoutes, visualRouteSteps } from '../db/schema';

// Linha da tabela visual_route
export interface VisualRoute {
  id: string;
  buildingId: string;
  title: string;
  destinationPoiId: string | null;
  originName: string | null;
  createdBy: string | null;
}

// linha da tabela visual_route_steps
export interface VisualRouteStep {
  id: string;
  visualRouteId: string;
  stepOrder: number;
  description: string;
  imageUrl: string;
  lat: string | null;
  lon: string | null;
}

// Objeto resposta da rota get buildings/id/accessibility
export interface VisualRouteStepResponse {
  stepOrder: number;
  description: string | null;
  imageUrl: string;
  lat: number | null;
  lon: number | null;
}

type RouteDbModel = InferSelectModel<typeof visualRoutes>;

export interface VisualRoutesWithSteps extends Omit<RouteDbModel, 'buildingId' | 'createdBy' | 'status'> {
  steps: VisualRouteStepResponse[];
}

// mensagem enviada pelo front para a rota post visual routes
export interface StepMetadataInput {
  stepOrder: number;
  description: string;
  lat: string;
  lon: string;
}
