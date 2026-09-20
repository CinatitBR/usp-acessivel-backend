import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  authProvider: text('auth_provider'),
  avatarUrl: text('avatar_url'),
  contributionCount: integer('contribution_count').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const buildings = sqliteTable('buildings', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  lat: real('lat').notNull(),
  lon: real('lon').notNull(),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
});

export const pois = sqliteTable('pois', {
  id: text('id').primaryKey(),
  buildingId: text('building_id').references(() => buildings.id, { onDelete: 'cascade' }),
  category: text('category', { enum: ['elevator', 'bathroom', 'ramp', 'bus','other'] }),
  name: text('name').notNull(),
  lat: real('lat').notNull(),
  lon: real('lon').notNull(),
  detailsJson: text('details_json'),
  imageUrl: text('image_url'),
    //String contendo um objeto JSON com os detalhes específicos variando de acordo com a categoria:
  // - **elevator**: `{"floors": ["T", "1", "2"], "cabin dimensions": "1.20m x 1.50m"}`
  // - **bathroom**: `{"is_unisex": true, "has_grab_bars": true, "is_pcd_exclusive": false}`
  // - **ramp**: `{"has_handrail": true, "steepness": "moderate"}`
  // - **bus**: `{"is_curb_adequate": true}`
  status: text('status', { enum: ['active', 'pending_moderation', 'rejected'] }).default('active'),
  createdBy: text('created_by').references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const poiEvaluations = sqliteTable('poi_evaluations', {
  id: text('id').primaryKey(),
  poiId: text('poi_id').notNull(),
  userId: text('user_id'),
  isPcd: integer('is_pcd', { mode: 'boolean' }),
  hadDifficulty: integer('had_difficulty', { mode: 'boolean' }),
  mobilityAid: text('mobility_aid'),
  description: text('description'),
});

export const visualRoutes = sqliteTable('visual_routes', {
  id: text('id').primaryKey(),
  buildingId: text('building_id')
    .references(() => buildings.id)
    .notNull(),
  title: text('title').notNull(),
  destinationPoiId: text('destination_poi_id').references(() => pois.id, { onDelete: 'cascade' }),
  originName: text('origin_name'),
  status: text('status', { enum: ['active', 'pending_moderation', 'rejected'] }).default('pending_moderation'),
  createdBy: text('created_by').references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const visualRouteSteps = sqliteTable('visual_route_steps', {
  id: text('id').primaryKey(),
  visualRouteId: text('visual_route_id')
    .notNull()
    .references(() => visualRoutes.id, { onDelete: 'cascade' }),
  stepOrder: integer('step_order').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  // Representa a localização desse passo no mapa: o lugar onde a imagem foi tirada.
  // Idealmente, essa informação é extraída automaticamente dos metadados da imagem.
  lat: real('lat'),
  lon: real('lon'),
});

export const mapReports = sqliteTable('map_reports', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  poiId: text('poi_id').references(() => pois.id, { onDelete: 'cascade' }),
  reportType: text('report_type', {
    enum: [
      'blocked_crosswalk',
      'pothole',
      'broken_elevator',
      'fallen_tree',
      'inaccessible_entrance',
      'irregular_surface',
      'sidewalk_surface', // imagem do piso
      'other',
    ],
  }),
  geomType: text('geom_type', { enum: ['point', 'line'] }), // caso a pessoa marque até onde vai o piso que ela está reportando o geom_type é line
  lat: real('lat').notNull(),
  lon: real('lon').notNull(),
  geometryJson: text('geometry_json'), // caso a pessoa envie um popup que representa algo que nao seja somente um ponto
  imageUrl: text('image_url'),
  detailsJson: text('details_json'), // {descr: descrição do problema}
  status: text('status', { enum: ['active', 'resolved', 'pending_moderation'] }).default('active'), // default active pois no momento nao temos o sistema de moderação
  rejectionsCount: integer('rejections_count').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
