CREATE TABLE `buildings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`lat` real,
	`lon` real,
	`address` text,
	`phone` text,
	`email` text,
	`website` text
);
--> statement-breakpoint
CREATE TABLE `map_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`report_type` text,
	`geom_type` text,
	`lat` real,
	`lon` real,
	`geometry_json` text,
	`image_url` text,
	`details_json` text,
	`status` text DEFAULT 'active',
	`confirmations` integer DEFAULT 1,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `poi_evaluations` (
	`id` text PRIMARY KEY NOT NULL,
	`poi_id` text,
	`user_id` text,
	`is_pcd` integer
);
--> statement-breakpoint
CREATE TABLE `pois` (
	`id` text PRIMARY KEY NOT NULL,
	`building_id` text,
	`category` text,
	`name` text,
	`lat` real,
	`lon` real,
	`details_json` text,
	`status` text DEFAULT 'active',
	`created_by` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`auth_provider` text,
	`avatar_url` text,
	`contribution_count` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `visual_route_steps` (
	`id` text PRIMARY KEY NOT NULL,
	`visual_route_id` text,
	`step_order` integer,
	`description` text,
	`image_url` text,
	FOREIGN KEY (`visual_route_id`) REFERENCES `visual_routes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `visual_routes` (
	`id` text PRIMARY KEY NOT NULL,
	`destination_poi_id` text,
	`origin_name` text,
	`status` text DEFAULT 'pending_moderation',
	`created_by` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`destination_poi_id`) REFERENCES `pois`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
