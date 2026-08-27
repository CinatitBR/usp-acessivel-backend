import type { Building } from '../models/buildings';
import { getAllBuildings as getAllBuildingsRepo } from '../repositories/buildings';

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
