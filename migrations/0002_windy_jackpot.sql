PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_visual_routes` (
	`id` text PRIMARY KEY NOT NULL,
	`building_id` text NOT NULL,
	`title` text NOT NULL,
	`destination_poi_id` text,
	`origin_name` text,
	`status` text DEFAULT 'pending_moderation',
	`created_by` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`destination_poi_id`) REFERENCES `pois`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_visual_routes`("id", "building_id", "title", "destination_poi_id", "origin_name", "status", "created_by", "created_at") SELECT "id", "building_id", "title", "destination_poi_id", "origin_name", "status", "created_by", "created_at" FROM `visual_routes`;--> statement-breakpoint
DROP TABLE `visual_routes`;--> statement-breakpoint
ALTER TABLE `__new_visual_routes` RENAME TO `visual_routes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;