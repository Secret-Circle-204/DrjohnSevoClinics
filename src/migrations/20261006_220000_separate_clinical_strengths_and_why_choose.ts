import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "about_clinical_strengths" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar,
      "icon_name" varchar
    );

    ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "strengths_title" varchar DEFAULT 'Our Strengths';

    DO $$ BEGIN
      ALTER TABLE "about_clinical_strengths" 
        ADD CONSTRAINT "about_clinical_strengths_parent_id_fk" 
        FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") 
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "about_clinical_strengths_order_idx" ON "about_clinical_strengths" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "about_clinical_strengths_parent_id_idx" ON "about_clinical_strengths" USING btree ("_parent_id");

    ALTER TABLE "home" DROP COLUMN IF EXISTS "why_choose_subtitle";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "about_clinical_strengths" DISABLE ROW LEVEL SECURITY;
    DROP TABLE IF EXISTS "about_clinical_strengths" CASCADE;
    ALTER TABLE "about" DROP COLUMN IF EXISTS "strengths_title";
    ALTER TABLE "home" ADD COLUMN IF NOT EXISTS "why_choose_subtitle" varchar;
  `)
}
