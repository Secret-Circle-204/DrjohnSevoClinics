import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_follow_ups_follow_up_type" AS ENUM('clinical_check', 'suture_removal', 'treatment_review', 'routine_recall', 'administrative');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_follow_ups_status" AS ENUM('pending', 'contacted', 'completed', 'cancelled');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE TABLE IF NOT EXISTS "follow_ups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" integer NOT NULL,
  	"appointment_id" integer,
  	"due_date" timestamp(3) with time zone NOT NULL,
  	"follow_up_type" "enum_follow_ups_follow_up_type" DEFAULT 'clinical_check' NOT NULL,
  	"status" "enum_follow_ups_status" DEFAULT 'pending' NOT NULL,
  	"notes" varchar,
  	"outcome" varchar,
  	"cancellation_reason" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "follow_ups_id" integer;
  EXCEPTION WHEN duplicate_column THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "follow_ups_client_idx" ON "follow_ups" USING btree ("client_id");
  CREATE INDEX IF NOT EXISTS "follow_ups_appointment_idx" ON "follow_ups" USING btree ("appointment_id");
  CREATE INDEX IF NOT EXISTS "follow_ups_due_date_idx" ON "follow_ups" USING btree ("due_date");
  CREATE INDEX IF NOT EXISTS "follow_ups_status_idx" ON "follow_ups" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "follow_ups_updated_at_idx" ON "follow_ups" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "follow_ups_created_at_idx" ON "follow_ups" USING btree ("created_at");

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_follow_ups_fk" FOREIGN KEY ("follow_ups_id") REFERENCES "public"."follow_ups"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_follow_ups_id_idx" ON "payload_locked_documents_rels" USING btree ("follow_ups_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "follow_ups" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "follow_ups" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_follow_ups_fk";
  
  DROP INDEX "payload_locked_documents_rels_follow_ups_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "follow_ups_id";
  DROP TYPE "public"."enum_follow_ups_follow_up_type";
  DROP TYPE "public"."enum_follow_ups_status";`)
}
