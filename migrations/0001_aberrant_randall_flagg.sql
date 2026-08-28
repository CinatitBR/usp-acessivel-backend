PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_buildings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`lat` real NOT NULL,
	`lon` real NOT NULL,
	`address` text,
	`phone` text,
	`email` text,
	`website` text
);
--> statement-breakpoint
INSERT INTO `__new_buildings`("id", "name", "lat", "lon", "address", "phone", "email", "website") SELECT "id", "name", "lat", "lon", "address", "phone", "email", "website" FROM `buildings`;--> statement-breakpoint
DROP TABLE `buildings`;--> statement-breakpoint
ALTER TABLE `__new_buildings` RENAME TO `buildings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_map_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`poi_id` text,
	`report_type` text,
	`geom_type` text,
	`lat` real NOT NULL,
	`lon` real NOT NULL,
	`geometry_json` text,
	`image_url` text,
	`details_json` text,
	`status` text DEFAULT 'active',
	`rejections_count` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`poi_id`) REFERENCES `pois`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_map_reports`("id", "user_id", "poi_id", "report_type", "geom_type", "lat", "lon", "geometry_json", "image_url", "details_json", "status", "rejections_count", "created_at") SELECT "id", "user_id", "poi_id", "report_type", "geom_type", "lat", "lon", "geometry_json", "image_url", "details_json", "status", "rejections_count", "created_at" FROM `map_reports`;--> statement-breakpoint
DROP TABLE `map_reports`;--> statement-breakpoint
ALTER TABLE `__new_map_reports` RENAME TO `map_reports`;--> statement-breakpoint
CREATE TABLE `__new_poi_evaluations` (
	`id` text PRIMARY KEY NOT NULL,
	`poi_id` text NOT NULL,
	`user_id` text,
	`is_pcd` integer,
	`had_difficulty` integer,
	`mobility_aid` text,
	`description` text
);
--> statement-breakpoint
INSERT INTO `__new_poi_evaluations`("id", "poi_id", "user_id", "is_pcd", "had_difficulty", "mobility_aid", "description") SELECT "id", "poi_id", "user_id", "is_pcd", "had_difficulty", "mobility_aid", "description" FROM `poi_evaluations`;--> statement-breakpoint
DROP TABLE `poi_evaluations`;--> statement-breakpoint
ALTER TABLE `__new_poi_evaluations` RENAME TO `poi_evaluations`;--> statement-breakpoint
CREATE TABLE `__new_pois` (
	`id` text PRIMARY KEY NOT NULL,
	`building_id` text,
	`category` text,
	`name` text NOT NULL,
	`lat` real NOT NULL,
	`lon` real NOT NULL,
	`details_json` text,
	`status` text DEFAULT 'active',
	`created_by` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_pois`("id", "building_id", "category", "name", "lat", "lon", "details_json", "status", "created_by", "created_at") SELECT "id", "building_id", "category", "name", "lat", "lon", "details_json", "status", "created_by", "created_at" FROM `pois`;--> statement-breakpoint
DROP TABLE `pois`;--> statement-breakpoint
ALTER TABLE `__new_pois` RENAME TO `pois`;--> statement-breakpoint
CREATE TABLE `__new_visual_route_steps` (
	`id` text PRIMARY KEY NOT NULL,
	`visual_route_id` text NOT NULL,
	`step_order` integer NOT NULL,
	`description` text,
	`image_url` text NOT NULL,
	`lat` real,
	`lon` real,
	FOREIGN KEY (`visual_route_id`) REFERENCES `visual_routes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_visual_route_steps`("id", "visual_route_id", "step_order", "description", "image_url", "lat", "lon") SELECT "id", "visual_route_id", "step_order", "description", "image_url", "lat", "lon" FROM `visual_route_steps`;--> statement-breakpoint
DROP TABLE `visual_route_steps`;--> statement-breakpoint
ALTER TABLE `__new_visual_route_steps` RENAME TO `visual_route_steps`;--> statement-breakpoint
ALTER TABLE `visual_routes` ADD `building_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `visual_routes` ADD `title` text NOT NULL;