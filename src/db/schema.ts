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
  name: text('name'),
  lat: real('lat'),
  lon: real('lon'),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
});

export const pois = sqliteTable('pois', {
  id: text('id').primaryKey(),
  buildingId: text('building_id').references(() => buildings.id, { onDelete: 'cascade' }),
  category: text('category', { enum: ['elevator', 'bathroom', 'ramp', 'other'] }),
  name: text('name'),
  lat: real('lat'),
  lon: real('lon'),
  detailsJson: text('details_json'),
  status: text('status', { enum: ['active', 'pending_moderation', 'rejected'] }).default('active'),
  createdBy: text('created_by').references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const poiEvaluations = sqliteTable('poi_evaluations', {
  id: text('id').primaryKey(),
  poiId: text('poi_id'), // We could add references, but keeping close to schema.sql
  userId: text('user_id'),
  isPcd: integer('is_pcd', { mode: 'boolean' }), // sqlite uses integer for boolean
});

export const visualRoutes = sqliteTable('visual_routes', {
  id: text('id').primaryKey(),
  destinationPoiId: text('destination_poi_id').references(() => pois.id, { onDelete: 'cascade' }),
  originName: text('origin_name'),
  status: text('status', { enum: ['active', 'pending_moderation', 'rejected'] }).default('pending_moderation'),
  createdBy: text('created_by').references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const visualRouteSteps = sqliteTable('visual_route_steps', {
  id: text('id').primaryKey(),
  visualRouteId: text('visual_route_id').references(() => visualRoutes.id, { onDelete: 'cascade' }),
  stepOrder: integer('step_order'),
  description: text('description'),
  imageUrl: text('image_url'),
});

export const mapReports = sqliteTable('map_reports', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  reportType: text('report_type', { enum: ['blocked_crosswalk', 'pothole', 'broken_elevator', 'fallen_tree', 'inaccessible_entrance', 'irregular_surface', 'sidewalk_surface', 'bus_stop_curb'] }),
  geomType: text('geom_type', { enum: ['point', 'line'] }),
  lat: real('lat'),
  lon: real('lon'),
  geometryJson: text('geometry_json'),
  imageUrl: text('image_url'),
  detailsJson: text('details_json'),
  status: text('status', { enum: ['active', 'resolved', 'pending_moderation'] }).default('active'),
  confirmations: integer('confirmations').default(1),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
