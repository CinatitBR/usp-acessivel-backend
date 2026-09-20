import { postMapReport } from "../models/mapReports";
import { drizzle } from 'drizzle-orm/d1';
import { mapReports } from "../db/schema";
import { and, gte, lte, eq } from "drizzle-orm";
import { MAP_REPORT_RULES} from "../utils/constants";


export const postMapReportRepo = async (db: D1Database, mapReport: postMapReport) => {
    const d1 = drizzle(db)

    await d1.insert(mapReports).values(mapReport).execute();

}


export const getMapReportsRepo = async (db: D1Database,  minLat: number, maxLat: number, minLon: number, maxLon: number) => {

    const d1 = drizzle(db);
    return await d1.select().from(mapReports).where( 
        and(
            gte(mapReports.lat, minLat),
            lte(mapReports.lat, maxLat),
            gte(mapReports.lon, minLon),
            lte(mapReports.lon, maxLon),
            eq(mapReports.status, "active"),
            lte(mapReports.rejectionsCount, MAP_REPORT_RULES.MAX_REJECTIONS_ALLOWED)


    )
        
    ).limit(MAP_REPORT_RULES.MAX_ITEMS_PER_SELECT_QUERY).execute();

}

