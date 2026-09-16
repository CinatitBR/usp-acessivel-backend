import { InsertPoi } from "../models/pois";
import { drizzle } from 'drizzle-orm/d1';
import { pois } from "../db/schema";

export const postPoiRepo = async (db: D1Database, poi: InsertPoi) => {

const d1 = drizzle(db);

await d1.insert(pois).values(poi).execute();


}