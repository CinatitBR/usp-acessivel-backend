import { postMapReport } from "../models/mapReports";
import { drizzle } from 'drizzle-orm/d1';
import { mapReports } from "../db/schema";

export const postMapReportRepo = async (db: D1Database, mapReport: postMapReport) => {
    const d1 = drizzle(db)

    await d1.insert(mapReports).values(mapReport).execute();
}