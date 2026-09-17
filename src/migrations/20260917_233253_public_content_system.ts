import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"featured_image_id" integer NOT NULL,
  	"category_id" integer NOT NULL,
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "youtube_videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"youtube_url" varchar NOT NULL,
  	"video_id" varchar,
  	"thumbnail_id" integer,
  	"category_id" integer,
  	"order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "home_why_choose_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"icon_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "home_before_after_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"before_image_id" integer NOT NULL,
  	"after_image_id" integer NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_badge" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_subtitle" varchar,
  	"overview_title" varchar,
  	"overview_text" varchar,
  	"overview_image_id" integer,
  	"why_choose_title" varchar,
  	"why_choose_subtitle" varchar,
  	"cta_headline" varchar,
  	"cta_subtitle" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"story_title" varchar,
  	"story_content" jsonb,
  	"story_image_id" integer,
  	"values_title" varchar,
  	"mission" varchar,
  	"vision" varchar,
  	"experience_narrative" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "clinic_info_phone_numbers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "clinic_info_opening_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"days" varchar NOT NULL,
  	"hours" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "clinic_info_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "clinic_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"clinic_name" varchar DEFAULT 'Dr. John Sevo Dental Clinic & Aesthetics' NOT NULL,
  	"email" varchar,
  	"address" varchar,
  	"location_on_map" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DROP TABLE IF EXISTS "testimonials" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_testimonials_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_testimonials_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "blog_posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "youtube_videos_id" integer;
  
  DO $$ BEGIN
    ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_doctors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "youtube_videos" ADD CONSTRAINT "youtube_videos_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "youtube_videos" ADD CONSTRAINT "youtube_videos_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "home_why_choose_items" ADD CONSTRAINT "home_why_choose_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "home_before_after_cases" ADD CONSTRAINT "home_before_after_cases_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "home_before_after_cases" ADD CONSTRAINT "home_before_after_cases_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "home_before_after_cases" ADD CONSTRAINT "home_before_after_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "home" ADD CONSTRAINT "home_overview_image_id_media_id_fk" FOREIGN KEY ("overview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "about" ADD CONSTRAINT "about_story_image_id_media_id_fk" FOREIGN KEY ("story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "clinic_info_phone_numbers" ADD CONSTRAINT "clinic_info_phone_numbers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clinic_info"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "clinic_info_opening_hours" ADD CONSTRAINT "clinic_info_opening_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clinic_info"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "clinic_info_social_links" ADD CONSTRAINT "clinic_info_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clinic_info"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "blog_posts_featured_image_idx" ON "blog_posts" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_category_idx" ON "blog_posts" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_author_idx" ON "blog_posts" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "youtube_videos_thumbnail_idx" ON "youtube_videos" USING btree ("thumbnail_id");
  CREATE INDEX IF NOT EXISTS "youtube_videos_category_idx" ON "youtube_videos" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "youtube_videos_updated_at_idx" ON "youtube_videos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "youtube_videos_created_at_idx" ON "youtube_videos" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "home_why_choose_items_order_idx" ON "home_why_choose_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "home_why_choose_items_parent_id_idx" ON "home_why_choose_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "home_before_after_cases_order_idx" ON "home_before_after_cases" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "home_before_after_cases_parent_id_idx" ON "home_before_after_cases" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "home_before_after_cases_before_image_idx" ON "home_before_after_cases" USING btree ("before_image_id");
  CREATE INDEX IF NOT EXISTS "home_before_after_cases_after_image_idx" ON "home_before_after_cases" USING btree ("after_image_id");
  CREATE INDEX IF NOT EXISTS "home_overview_image_idx" ON "home" USING btree ("overview_image_id");
  CREATE INDEX IF NOT EXISTS "about_story_image_idx" ON "about" USING btree ("story_image_id");
  CREATE INDEX IF NOT EXISTS "clinic_info_phone_numbers_order_idx" ON "clinic_info_phone_numbers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "clinic_info_phone_numbers_parent_id_idx" ON "clinic_info_phone_numbers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "clinic_info_opening_hours_order_idx" ON "clinic_info_opening_hours" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "clinic_info_opening_hours_parent_id_idx" ON "clinic_info_opening_hours" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "clinic_info_social_links_order_idx" ON "clinic_info_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "clinic_info_social_links_parent_id_idx" ON "clinic_info_social_links" USING btree ("_parent_id");

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_youtube_videos_fk" FOREIGN KEY ("youtube_videos_id") REFERENCES "public"."youtube_videos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_youtube_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("youtube_videos_id");
  
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "testimonials_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"display_name" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"treatment_id" integer,
  	"patient_photo_id" integer,
  	"verified" boolean DEFAULT true,
  	"consent_given" boolean DEFAULT true NOT NULL,
  	"is_published" boolean DEFAULT false,
  	"featured" boolean DEFAULT false,
  	"date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "youtube_videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_why_choose_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_before_after_cases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clinic_info_phone_numbers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clinic_info_opening_hours" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clinic_info_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clinic_info" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "blog_posts" CASCADE;
  DROP TABLE "youtube_videos" CASCADE;
  DROP TABLE "home_why_choose_items" CASCADE;
  DROP TABLE "home_before_after_cases" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "clinic_info_phone_numbers" CASCADE;
  DROP TABLE "clinic_info_opening_hours" CASCADE;
  DROP TABLE "clinic_info_social_links" CASCADE;
  DROP TABLE "clinic_info" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_youtube_videos_fk";
  
  DROP INDEX "payload_locked_documents_rels_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_youtube_videos_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_treatment_id_treatments_id_fk" FOREIGN KEY ("treatment_id") REFERENCES "public"."treatments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_patient_photo_id_media_id_fk" FOREIGN KEY ("patient_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "testimonials_treatment_idx" ON "testimonials" USING btree ("treatment_id");
  CREATE INDEX "testimonials_patient_photo_idx" ON "testimonials" USING btree ("patient_photo_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "youtube_videos_id";`)
}
