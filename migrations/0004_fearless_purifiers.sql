PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_map_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`poi_id` text,
	`building_id` text,
	`report_type` text NOT NULL,
	`severity` text,
	`lat` real NOT NULL,
	`lon` real NOT NULL,
	`image_url` text,
	`details_json` text,
	`status` text DEFAULT 'active',
	`rejections_count` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`poi_id`) REFERENCES `pois`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`building_id`) REFERENCES `buildings`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_map_reports`("id", "user_id", "poi_id", "building_id", "report_type", "severity", "lat", "lon", "image_url", "details_json", "status", "rejections_count", "created_at") SELECT "id", "user_id", "poi_id", "building_id", "report_type", "severity", "lat", "lon", "image_url", "details_json", "status", "rejections_count", "created_at" FROM `map_reports`;--> statement-breakpoint
DROP TABLE `map_reports`;--> statement-breakpoint
ALTER TABLE `__new_map_reports` RENAME TO `map_reports`;--> statement-breakpoint
PRAGMA foreign_keys=ON;