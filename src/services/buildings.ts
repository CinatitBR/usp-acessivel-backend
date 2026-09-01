import type { Building } from '../models/buildings';
import { getAllBuildings as getAllBuildingsRepo } from '../repositories/buildings';
import { getBuildingAccessibilityById } from '../repositories/buildings';

export const getBuildingsList = async (db: D1Database): Promise<Building[]> => {
  try {
    const buildings = await getAllBuildingsRepo(db);
    return buildings;
  } catch (error) {
    console.error('Erro interno ao buscar prédios (D1):', error);
    // Codigo de erro padronizado
    throw new Error('ERR_FETCH_BUILDINGS_FAILED');
  }
};
 

export const getBuildingAccessibilityService = async (db: D1Database, id: string) => {
  if(!id || id.trim() === ''){
    throw new Error('ERR_MISSING_BUILDING_ID');
  }

  try{

    const accessibilityData = await getBuildingAccessibilityById(db, id);
    if(!accessibilityData){
      throw new Error('ERR_BUILDING_NOT_FOUND');
    }

    return accessibilityData

  } catch(error) {
    if(error instanceof Error && error.message.startsWith('ERR_')){
      throw error;
    }

    console.error(`Falha ao buscar acessibilidade do prédio: ${id}`, error);
    throw new Error('ERR_FETCH_ACCESSIBILITY_FAILED');
  }


}
