import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_home_trust_stats_icon_key" AS ENUM('users', 'star', 'award', 'heartHandshake', 'shield', 'clock');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "home_trust_stats" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar NOT NULL,
    "label" varchar NOT NULL,
    "icon_key" "enum_home_trust_stats_icon_key" DEFAULT 'star'
  );
  
  CREATE TABLE IF NOT EXISTS "about_core_values" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "description" varchar NOT NULL
  );
  
  ALTER TABLE "inquiries" ALTER COLUMN "email" SET NOT NULL;
  
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "founder_title" varchar DEFAULT 'A Word from the Founder';
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "founder_quote" varchar;
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "founder_name" varchar DEFAULT 'Dr. John Sevo Dawod';
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "founder_role" varchar DEFAULT 'Founder & Medical Director';
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "positioning" varchar;

  DO $$ BEGIN
    ALTER TABLE "home_trust_stats" ADD CONSTRAINT "home_trust_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "about_core_values" ADD CONSTRAINT "about_core_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "home_trust_stats_order_idx" ON "home_trust_stats" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "home_trust_stats_parent_id_idx" ON "home_trust_stats" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "about_core_values_order_idx" ON "about_core_values" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "about_core_values_parent_id_idx" ON "about_core_values" USING btree ("_parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_trust_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_core_values" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "home_trust_stats" CASCADE;
  DROP TABLE IF EXISTS "about_core_values" CASCADE;
  ALTER TABLE "inquiries" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "about" DROP COLUMN IF EXISTS "founder_title";
  ALTER TABLE "about" DROP COLUMN IF EXISTS "founder_quote";
  ALTER TABLE "about" DROP COLUMN IF EXISTS "founder_name";
  ALTER TABLE "about" DROP COLUMN IF EXISTS "founder_role";
  ALTER TABLE "about" DROP COLUMN IF EXISTS "positioning";
  DROP TYPE IF EXISTS "public"."enum_home_trust_stats_icon_key";
  `)
}
