import { mapReports } from "../db/schema";

export type postMapReport = typeof mapReports.$inferInsert;

export interface postMapReportRequest {
    userId: string | null,
    poiId: string | null,
    reportType: 'blocked_crosswalk'|'pothole' | 'broken_elevator' | 'fallen_tree' | 'inaccessible_entrance' | 'irregular_surface' | 'sidewalk_surface' | 'other',
    geomType: 'point' | 'line',
    lat: number,
    lon: number,
    geometryJson: string | null,
    detailsJson: string | null,
    image?: File | null
}

