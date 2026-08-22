// Modelo auxiliar para exibir os pontos de interesse de um prédio na tela que lista os institutos da USP
export interface AcessibilityPoint {
    id: string;
    category: string; // ex: 'elevator', 'bathroom', 'ramp'
    name: string; // ex: "Elevadores", "Banheiro PCD", é o que está exibido na tela
};

export interface Bulding {
    id: string | null;
    name: string | null;
    address: string | null;
    phone: string | null;
    website: string | null;
    acessibilityPoints: AcessibilityPoint[];
}