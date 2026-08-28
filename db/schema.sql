PRAGMA foreign_keys = ON;

-- Usuarios, modelado para aceitar tanto login da USP (quem sabe a gente consegue) quanto e-mail/senha convencional
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    auth_provider TEXT,
    avatar_url TEXT,
    contribution_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Prédios 
CREATE TABLE IF NOT EXISTS buildings (
    id TEXT PRIMARY KEY,
    name TEXT,
    lat REAL,
    lon REAL,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT
);

-- PONTOS DE INTERESSE (ELEVADORES, BANHEIROS E PONTOS FORA DE PRÉDIOS)
CREATE TABLE IF NOT EXISTS pois (
    id TEXT PRIMARY KEY,
    building_id TEXT, 
    category TEXT CHECK(category in ('elevator', 'bathroom', 'ramp', 'other')),
    name TEXT,
    lat REAL,
    lon REAL, 
    
    -- FORMATOS ESPERADOS PARA O details_json (Varia pela 'category'):
    -- elevator: {"floors": ["T", "1", "2"], "cabin dimensions": "1.20m x 1.50m"} -- esse de dimensões pode ser opicional, se não as pessoas não vão mandar por não querer medir
    -- bathroom: {"is_unisex": true, "has_grab_bars": true, "is_pcd_exclusive": false}
    -- ramp:     {"has_handrail": true, "steepness": "moderate"}
    details_json TEXT, 
    
    status TEXT DEFAULT 'active' CHECK(status in ('active', 'pending_moderation', 'rejected')),
    created_by TEXT, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 4. AVALIAÇÕES DOS POIs (Mini Questionário)
CREATE TABLE IF NOT EXISTS poi_evaluations (
    id TEXT PRIMARY KEY,
    poi_id TEXT,
    user_id TEXT,
    is_pcd BOOLEAN,
    had_difficulty BOOLEAN,
    mobility_aid TEXT,
    description TEXT

);

-- Rotas visuais, exemplo: rotas da entrada até um elevador
CREATE TABLE IF NOT EXISTS visual_routes (
    id TEXT PRIMARY KEY,
    destination_poi_id TEXT,
    origin_name TEXT,
    status TEXT DEFAULT 'pending_moderation' CHECK(status in ('active', 'pending_moderation', 'rejected')), 
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_poi_id) REFERENCES pois(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabela para ordenar as imagens das rotas internas
CREATE TABLE IF NOT EXISTS visual_route_steps(
    id TEXT PRIMARY KEY, 
    visual_route_id TEXT,
    step_order INTEGER, 
    description TEXT,
    image_url TEXT,
    FOREIGN KEY (visual_route_id) REFERENCES visual_routes(id) ON DELETE CASCADE
);

-- 6. REPORTES DO MAPA (Calçadas, Alertas Waze)
CREATE TABLE IF NOT EXISTS map_reports (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    poi_id TEXT, -- caso o report seja sobre um poi especifico, tipo elevador quebrado
    report_type TEXT CHECK(report_type in ('blocked_crosswalk', 'pothole', 'broken_elevator', 'fallen_tree', 'inaccessible_entrance', 'irregular_surface', 'sidewalk_surface', 'bus_stop_curb', 'other')), -- bus stop curb é para aquilo de se a guia do ponto de ônibus está reformada ou não
    geom_type TEXT CHECK(geom_type in ('point', 'line')), -- caso a pessoa coloque até onde vai o piso que ela vai enviar
    lat REAL,
    lon REAL,
    geometry_json TEXT, 
    image_url TEXT,
    
    -- FORMATOS ESPERADOS PARA O details_json (Varia pelo 'report_type'):
    -- blocked_crosswalk/pothole/broken_elevator/inaccessible_entrance/irregular_surface, fallen_tree:
    --   {"desc": "Descrição do problema"}
    -- sidewalk_surface: 
    --  {"surface_type": "tactile_paving", "mobility_aid": "wheelchair", "had_difficulty": true}
    -- bus_stop_curb: 
    --   {"curb_is_adequate": false, "desc": "Guia muito alta para embarque"}
    -- other
    -- {"descr: Descrição}
    details_json TEXT, 
    
    status TEXT DEFAULT 'active' CHECK(status in ('active', 'resolved', 'pending_moderation')),
    rejections_count INTEGER DEFAULT 0, -- quantas pessoas disseram que esse problema nao existe mais, quando bater um numero x o popup some
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (poi_id) REFERENCES pois(id) ON DELETE CASCADE
);

