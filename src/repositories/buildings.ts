import type { Building, AccessibilityPoint } from "../models/building";

export const getAllBuildings = async (db: D1Database): Promise<Building[]> => {

    // trazemos todos os prédios do banco de dados
    const {results: buildingsDb} = await db.prepare('SELECT * FROM buildings ORDER BY name ASC').all();

    // trazemos os pontos de interesse que estão ativos (já foram aprovados pela moderação)
    const {results:  poisDb} = await db.prepare("SELECT id, building_id, category, name, status FROM pois WHERE status = 'active'").all();

    // transformando os dados no objeto que a tela precisa
    const formattedBuildings: Building[] = buildingsDb.map((bldgRow: any) => {
        
        const buildingPois = poisDb.filter((poi: any) => poi.building_id === bldgRow.id);

        const accessibilityPoints: AccessibilityPoint[] = buildingPois.map((poi: any) => ({
            id: poi.id,
            category: poi.category,
            name: poi.name,
        }));

        return {
            id: bldgRow.id,
            name: bldgRow.name,
            address: bldgRow.address || null,
            phone: bldgRow.phone || null,
            email: bldgRow.email || null,
            website: bldgRow.website || null,
            AccessibilityPoints: accessibilityPoints
        };

    });
    
  return formattedBuildings;  
};