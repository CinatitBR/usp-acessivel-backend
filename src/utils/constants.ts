export const MAP_REPORT_RULES = {
    MAX_REJECTIONS_ALLOWED: 2, // quando 3 pessoas disserem que o problema daquele popup de alerta nao existe mais ele deverá sumir do mapa
    MAX_ITEMS_PER_SELECT_QUERY: 40 // na quey de pegar as tuplas da tabela map reports estou definindo um limite de 40 linhas para caso o usuario diminua muito o zoom o celular dele não trave com o numero elevado de popups
} as const