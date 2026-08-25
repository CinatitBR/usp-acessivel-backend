-- 1. Inserindo Usuários
INSERT INTO users (id, name, email, auth_provider, avatar_url, contribution_count) 
VALUES 
('usr_001', 'Ana Clara', 'anaclara@usp.br', 'usp_sso', 'https://exemplo.com/avatar_ana.png', 25),
('usr_002', 'Marcos Silva', 'marcos.s@gmail.com', 'email_password', NULL, 5);

-- 2. Inserindo um Prédio (FFLCH - Cidade Universitária, direto do seu protótipo!)
INSERT INTO buildings (id, name, lat, lon, address, phone, email, website) 
VALUES 
('bldg_001', 'Faculdade de Filosofia, Letras e Ciências Humanas', -23.5596, -46.7268, 'Rua do Lago, 717, Butantã, São Paulo - SP, 05508-080', '(11) 3091-4612', 'fflch@usp.br', 'https://www.fflch.usp.br/');

-- 3. Inserindo Pontos de Interesse (POIs) com os JSONs respeitando os contratos
INSERT INTO pois (id, building_id, category, name, lat, lon, details_json, status, created_by) 
VALUES 
('poi_001', 'bldg_001', 'elevator', 'Elevador Principal', -23.55961, -46.72681, '{"floors": ["T", "1", "2"], "cabin dimensions": "1.20m x 1.50m"}', 'active', 'usr_001'),
('poi_002', 'bldg_001', 'bathroom', 'Banheiro PCD - Térreo', -23.55962, -46.72682, '{"is_unisex": true, "has_grab_bars": true, "is_pcd_exclusive": false}', 'active', 'usr_001'),
('poi_003', 'bldg_001', 'ramp', 'Rampa de Acesso Externo', -23.55963, -46.72683, '{"has_handrail": true, "steepness": "moderate"}', 'active', 'usr_001');

-- 4. Inserindo uma Avaliação de POI
INSERT INTO poi_evaluations (id, poi_id, user_id, is_pcd, had_difficulty, mobility_aid, description) 
VALUES 
('eval_001', 'poi_001', 'usr_002', false, false, 'wheelchair', 'A cadeira motorizada coube muito bem, botões em boa altura.');

-- 5. Inserindo uma Rota Visual (Ex: Da portaria até o elevador)
INSERT INTO visual_routes (id, destination_poi_id, origin_name, status, created_by)
VALUES
('route_001', 'poi_001', 'Portaria Principal', 'active', 'usr_001');

-- 6. Inserindo os Passos dessa Rota Visual
INSERT INTO visual_route_steps (id, visual_route_id, step_order, description, image_url)
VALUES
('step_001', 'route_001', 1, 'Passe pela catraca e siga reto no corredor principal.', 'https://bucket.com/route_001_step_1.jpg'),
('step_002', 'route_001', 2, 'Vire à direita ao final do corredor, o elevador estará à sua frente.', 'https://bucket.com/route_001_step_2.jpg');

-- 7. Inserindo Reportes de Mapa variados pela Cidade Universitária
INSERT INTO map_reports (id, user_id, report_type, geom_type, lat, lon, geometry_json, image_url, details_json, status)
VALUES
-- Reporte 1: Buraco na via perto do prédio
('rep_001', 'usr_002', 'pothole', 'point', -23.5597, -46.7269, NULL, NULL, '{"desc": "Buraco grande na calçada da Rua do Lago, perigoso para cadeiras."}', 'active'),

-- Reporte 2: Piso Tátil (Avaliação de dificuldade)
('rep_002', 'usr_001', 'sidewalk_surface', 'point', -23.5598, -46.7270, NULL, NULL, '{"surface_type": "tactile_paving", "mobility_aid": "wheelchair", "had_difficulty": true}', 'active'),

-- Reporte 3: Guia do ponto de ônibus da Circular
('rep_003', 'usr_002', 'bus_stop_curb', 'point', -23.5599, -46.7271, NULL, NULL, '{"curb_is_adequate": false, "desc": "Degrau muito alto para embarcar no circular."}', 'active');