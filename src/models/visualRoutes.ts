
// Linha da tabela visual_route
export interface VisualRoute {
    id: string;
    destination_poi_id: string | null;
    origin_name: string | null;
    created_by: string | null;
}

// linha da tabela visual_route_steps 
export interface VisualRouteStep {
    id: string;
    visual_route_id: string;
    step_order: number
    description: string;
    image_url: string;
}

// mensagem enviada pelo front
export interface StepMetadataInput {
    step_order: number;
    description: string;
}