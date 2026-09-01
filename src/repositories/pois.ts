import { drizzle } from 'drizzle-orm/d1';
import { pois } from '../db/schema';

export const getPois = async (db: D1Database, limit: number, offset: number) => {
  const d1 = drizzle(db);

  return await d1
    .select({
      id: pois.id,
      buildingId: pois.buildingId,
      category: pois.category,
      name: pois.name,
      lat: pois.lat,
      lon: pois.lon,
      detailsJson: pois.detailsJson,
      status: pois.status,
      createdAt: pois.createdAt,
    })
    .from(pois)
    .limit(limit)
    .offset(offset);
};
