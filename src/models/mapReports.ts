import { mapReports } from "../db/schema";

export type postMapReport = typeof mapReports.$inferInsert;

export interface postMapReportRequest {
    userId: string | null,
    poiId: string | null,
    buildingId: string | null,
    reportType: 'pothole' | 'irregular_surface' | 'narrow_sidewalk' | 'inaccessible_entrance' | 'inaccessible_floor' | 'broken_elevator' | 'inaccessible_bathroom' | 'other',
    severity: 'moderate' | 'severe' | null,
    lat: number,
    lon: number,
    detailsJson: string | null,
    description: string | null,
    image?: File | null
}
