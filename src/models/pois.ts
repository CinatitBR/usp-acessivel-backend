import {pois} from '../db/schema';


// Formato do request enviado pelo front end
export interface PostPoiRequest {
    buildingId: string | null;
    category: 'elevator' | 'bathroom' | 'ramp' | 'bus' | 'other';
    name: string;
    lat: number;
    lon: number;
    detailsJson: string;
    createdBy: string;
}

export type InsertPoi = typeof pois.$inferInsert