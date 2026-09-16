-- Insere prédios da USP Campus Butantã

INSERT OR IGNORE INTO buildings (id, name, lon, lat) VALUES
  -- Exatas e Tecnologia
  ('ime', 'Instituto de Matemática e Estatística (IME)', -46.731765, -23.557434),
  ('if', 'Instituto de Física (IF)', -46.732389, -23.561561),
  ('iq', 'Instituto de Química (IQ)', -46.729444, -23.564722),
  ('poli', 'Escola Politécnica (EP / Poli)', -46.731944, -23.555278),
  ('iag', 'Instituto de Astronomia, Geofísica e Ciências Atmosféricas (IAG)', -46.735833, -23.559444),
  ('igc', 'Instituto de Geociências (IGc)', -46.733611, -23.560278),
  ('iee', 'Instituto de Energia e Ambiente (IEE)', -46.735278, -23.553889),
  ('icb', 'Instituto de Ciências Biomédicas (ICB)', -46.737222, -23.566111),

  -- Humanas, Sociais Aplicadas e Artes
  ('fflch', 'Faculdade de Filosofia, Letras e Ciências Humanas (FFLCH)', -46.725833, -23.559722),
  ('feausp', 'Faculdade de Economia, Administração, Contabilidade e Atuária (FEA)', -46.728889, -23.558611),
  ('eca', 'Escola de Comunicações e Artes (ECA)', -46.727500, -23.560833),
  ('fau', 'Faculdade de Arquitetura e Urbanismo (FAU)', -46.730278, -23.560833),
  ('fe', 'Faculdade de Educação (FE)', -46.724722, -23.558889),
  ('iea', 'Instituto de Estudos Avançados (IEA)', -46.728611, -23.562222),
  ('ieb', 'Instituto de Estudos Brasileiros (IEB)', -46.729167, -23.560278),
  ('iri', 'Instituto de Relações Internacionais (IRI)', -46.729722, -23.562500),

  -- Biológicas, Saúde e Agrárias
  ('ib', 'Instituto de Biociências (IB)', -46.734167, -23.566389),
  ('fcf', 'Faculdade de Ciências Farmacêuticas (FCF)', -46.736389, -23.565833),
  ('fousp', 'Faculdade de Odontologia (FO)', -46.738286, -23.566875),
  ('fmvz', 'Faculdade de Medicina Veterinária e Zootecnia (FMVZ)', -46.741389, -23.564444),
  ('eefe', 'Escola de Educação Física e Esporte (EEFE)', -46.722500, -23.556667),
  ('ip', 'Instituto de Psicologia (IP)', -46.724444, -23.562222),
  ('io', 'Instituto Oceanográfico (IO)', -46.733889, -23.558611),

  -- Órgãos Centrais & Inovação
  ('reitoria', 'Reitoria da Universidade de São Paulo', -46.728333, -23.559167),
  ('inova-usp', 'Inova USP', -46.734735, -23.560584),
  ('cepeusp', 'Centro de Práticas Esportivas (CEPEUSP)', -46.720833, -23.558333),
  ('sas', 'Superintendência de Assistência Social (SAS / CRUSP)', -46.730833, -23.563333);


 -- 1. Inserindo um Ponto de Acessibilidade (POI) no IME
INSERT OR IGNORE INTO pois (id, building_id, category, name, details_json, lat, lon, created_at) VALUES 
  ('elevador_principal_bloco_a', 'ime', 'elevator', 'Elevador Principal Bloco A', '{"floors": ["T", "1", "2"], "cabin dimensions": "1.20m x 1.50m"}', -23.557434, -46.731765, CURRENT_TIMESTAMP),
  ('banheiro_ime_terreo_1', 'ime', 'bathroom', 'Banheiro PCD Térreo', '{"has_grab_bars": true}', -23.557434, -46.731765, CURRENT_TIMESTAMP);

-- 2. Inserindo uma Rota Visual no IME
INSERT OR IGNORE INTO visual_routes (id, building_id, title, destination_poi_id, origin_name, created_at) VALUES 
  ('rota_ime_1', 'ime', 'Entrada Principal até o Elevador', 'elevador_principal_bloco_a', 'Portaria Principal', CURRENT_TIMESTAMP);

-- 3. Inserindo os Passos da Rota (Atenção ao visual_route_id)
INSERT OR IGNORE INTO visual_route_steps (id, visual_route_id, step_order, description, image_url, lat, lon) VALUES 
  ('step_ime_1_1', 'rota_ime_1', 1, 'Passe pela catraca da portaria principal', 'https://via.placeholder.com/300x200?text=Passo+1', -23.557434, -46.731765),
  ('step_ime_1_2', 'rota_ime_1', 2, 'Siga reto pelo corredor principal por 10 metros', 'https://via.placeholder.com/300x200?text=Passo+2', -23.557434, -46.731765),
  ('step_ime_1_3', 'rota_ime_1', 3, 'O elevador estará à sua esquerda antes da escada', 'https://via.placeholder.com/300x200?text=Passo+3', -23.557434, -46.731765);
