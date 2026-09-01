import { VisualRoutesWithSteps } from "./visualRoutes";



// Modelo auxiliar para exibir os pontos de interesse de um prédio na tela que lista os institutos da USP
export interface AccessibilityPoint {
  id: string | null;
  category: string | null; // ex: 'elevator', 'bathroom', 'ramp'
  name: string  | null; // ex: "Elevadores", "Banheiro PCD", é o que está exibido na tela
}

export interface DetailedAccessibilityPoint extends AccessibilityPoint{
  detailsJson: string | null,
  createdAt: string | null
}

export interface Building {
  id: string | null;
  name: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  AccessibilityPoints: AccessibilityPoint[] | null;
}

export interface BuildingAccessibility {
  id: string,
  name: string,
  pois: DetailedAccessibilityPoint[],
  visualRoutes: VisualRoutesWithSteps[]

}
