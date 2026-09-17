import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "treatments" CASCADE;
  DROP TABLE IF EXISTS "treatments_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_treatments_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_treatments_id_idx";
  ALTER TABLE "youtube_videos" DROP COLUMN IF EXISTS "video_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "treatments_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "treatments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"service_id" integer NOT NULL,
  	"short_description" varchar NOT NULL,
  	"description" jsonb,
  	"duration" varchar,
  	"featured_image_id" integer,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "treatments_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"doctors_id" integer
  );
  
  ALTER TABLE "youtube_videos" ADD COLUMN "video_id" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "treatments_id" integer;
  ALTER TABLE "treatments" ADD CONSTRAINT "treatments_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "treatments" ADD CONSTRAINT "treatments_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "treatments_rels" ADD CONSTRAINT "treatments_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "treatments_rels" ADD CONSTRAINT "treatments_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "treatments_slug_idx" ON "treatments" USING btree ("slug");
  CREATE INDEX "treatments_service_idx" ON "treatments" USING btree ("service_id");
  CREATE INDEX "treatments_featured_image_idx" ON "treatments" USING btree ("featured_image_id");
  CREATE INDEX "treatments_updated_at_idx" ON "treatments" USING btree ("updated_at");
  CREATE INDEX "treatments_created_at_idx" ON "treatments" USING btree ("created_at");
  CREATE INDEX "treatments_rels_order_idx" ON "treatments_rels" USING btree ("order");
  CREATE INDEX "treatments_rels_parent_idx" ON "treatments_rels" USING btree ("parent_id");
  CREATE INDEX "treatments_rels_path_idx" ON "treatments_rels" USING btree ("path");
  CREATE INDEX "treatments_rels_doctors_id_idx" ON "treatments_rels" USING btree ("doctors_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_treatments_fk" FOREIGN KEY ("treatments_id") REFERENCES "public"."treatments"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_treatments_id_idx" ON "payload_locked_documents_rels" USING btree ("treatments_id");`)
}
