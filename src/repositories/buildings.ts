import type { Building, AccessibilityPoint } from '../models/buildings';
import { drizzle } from 'drizzle-orm/d1';
import { buildings, pois, visualRoutes, visualRouteSteps} from '../db/schema';
import { eq, asc, inArray } from 'drizzle-orm';
import { BuildingAccessibility } from '../models/buildings';

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

export const getBuildingById = async (db: D1Database, id: string) => {
  const d1 = drizzle(db);
  return await d1.select().from(buildings).where(eq(buildings.id, id)).get();
};

export const getBuildingAccessibilityById = async (db: D1Database, id: string): Promise<BuildingAccessibility | null> => {
  const d1 = drizzle(db);

// extrai as colunas name e id do predio 
const building = await d1.select({
  id: buildings.id,
  name: buildings.name
}).from(buildings).where(eq(buildings.id, id)).get();

if(!building){
  return null;
}

// retorna os pois do predio desejado
const buildingPois = await d1.select({
  id: pois.id,
  category: pois.category,
  name: pois.name,  
  detailsJson: pois.detailsJson,
  createdAt: pois.createdAt,
}).from(pois).where(eq(pois.buildingId, id)).all();

// select visualRoutes id = building id
const buildingVisualRoutes = await d1.select({
  id: visualRoutes.id,
  title: visualRoutes.title,
  destinationPoi: visualRoutes.destinationPoiId,
  originName: visualRoutes.originName,
  createdAt: visualRoutes.createdAt
}).from(visualRoutes).where(eq(visualRoutes.buildingId, id)).all();

// extrai o array de routeIds obtidos na query anterior
const routeIdArray: string[] = buildingVisualRoutes.map((row) => row.id);


// select visualroutesteps where routeid in array extraído anteriormente
let routeSteps: { routeId: string, stepOrder: number, description: string | null, imageUrl: string, lat: number | null, lon: number | null }[] = [];

if(routeIdArray.length > 0) {
routeSteps = await d1.select({
  routeId: visualRouteSteps.visualRouteId,
  stepOrder: visualRouteSteps.stepOrder,
  description: visualRouteSteps.description,
  imageUrl: visualRouteSteps.imageUrl,
  lat: visualRouteSteps.lat,
  lon: visualRouteSteps.lon
}).from(visualRouteSteps).where(inArray(visualRouteSteps.visualRouteId, routeIdArray)).all();
}
// constroi o objeto final que irá ser retornado

const stepsByRoute = routeSteps.reduce((acc, step) => {
  if (!acc[step.routeId]){
    acc[step.routeId] = [];
  }
  acc[step.routeId].push(step);
  return acc;
}, {} as Record<string, typeof routeSteps>)

const formattedRoutes = buildingVisualRoutes.map((route) => {

const currentSteps = stepsByRoute[route.id] || [];

const sortedSteps = currentSteps.sort((a, b) => a.stepOrder - b.stepOrder).map((s) => ({
  stepOrder: s.stepOrder,
  description: s.description,
  imageUrl: s.imageUrl,
  lat: s.lat,
  lon: s.lon
}));

return {
    id: route.id,
    title: route.title,
    destinationPoiId: route.destinationPoi,
    originName: route.originName,
    createdAt: route.createdAt,
    steps: sortedSteps
  };
});

return {
  id: building.id,
  name: building.name,
  pois: buildingPois, 
  visualRoutes: formattedRoutes 
};
}
