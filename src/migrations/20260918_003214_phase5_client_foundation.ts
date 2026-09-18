import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_clients_gender" AS ENUM('male', 'female');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_clients_status" AS ENUM('active', 'inactive', 'archived');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE TABLE IF NOT EXISTS "clients" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"date_of_birth" timestamp(3) with time zone,
  	"gender" "enum_clients_gender",
  	"address" varchar,
  	"emergency_contact_name" varchar,
  	"emergency_contact_relationship" varchar,
  	"emergency_contact_phone" varchar,
  	"status" "enum_clients_status" DEFAULT 'active' NOT NULL,
  	"internal_notes" varchar,
  	"user_id" integer,
  	"notification_preferences_email_notifications" boolean DEFAULT true,
  	"notification_preferences_dashboard_notifications" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "clients_id" integer;
  EXCEPTION WHEN duplicate_column THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "clients_phone_idx" ON "clients" USING btree ("phone");
  CREATE UNIQUE INDEX IF NOT EXISTS "clients_user_idx" ON "clients" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "clients_updated_at_idx" ON "clients" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "clients_created_at_idx" ON "clients" USING btree ("created_at");

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_clients_id_idx" ON "payload_locked_documents_rels" USING btree ("clients_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "clients" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "clients" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_clients_fk";
  
  DROP INDEX "payload_locked_documents_rels_clients_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "clients_id";
  DROP TYPE "public"."enum_clients_gender";
  DROP TYPE "public"."enum_clients_status";`)
}
