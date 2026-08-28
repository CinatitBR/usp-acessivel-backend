import type { Building, AccessibilityPoint } from '../models/buildings';
import { drizzle } from 'drizzle-orm/d1';
import { buildings, pois } from '../db/schema';
import { eq, asc } from 'drizzle-orm';

export const getAllBuildings = async (db: D1Database): Promise<Building[]> => {
  const d1 = drizzle(db);
  // trazemos todos os prédios do banco de dados
  const buildingsDb = await d1.select().from(buildings).orderBy(asc(buildings.name));

  // trazemos os pontos de interesse que estão ativos (já foram aprovados pela moderação)
  const poisDb = await d1.select({
    id: pois.id,
    buildingId: pois.buildingId,
    category: pois.category,
    name: pois.name,
    status: pois.status,
  }).from(pois).where(eq(pois.status, 'active'));

  // transformando os dados no objeto que a tela precisa
  const formattedBuildings: Building[] = buildingsDb.map((bldgRow) => {
    const buildingPois = poisDb.filter((poi) => poi.buildingId === bldgRow.id);

    const accessibilityPoints: AccessibilityPoint[] = buildingPois.map((poi) => ({
      id: poi.id,
      category: poi.category || '',
      name: poi.name || '',
    }));

    return {
      id: bldgRow.id,
      name: bldgRow.name,
      address: bldgRow.address || null,
      phone: bldgRow.phone || null,
      email: bldgRow.email || null,
      website: bldgRow.website || null,
      AccessibilityPoints: accessibilityPoints,
    };
  });

  return formattedBuildings;
};
