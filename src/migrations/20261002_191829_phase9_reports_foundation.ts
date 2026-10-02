import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_reports_report_type" AS ENUM('clinical_summary', 'referral_letter');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_reports_status" AS ENUM('draft', 'finalized', 'cancelled');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE TABLE IF NOT EXISTS "reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"client_id" integer NOT NULL,
  	"doctor_id" integer,
  	"consultation_id" integer,
  	"appointment_id" integer,
  	"report_date" timestamp(3) with time zone NOT NULL,
  	"report_type" "enum_reports_report_type" DEFAULT 'clinical_summary' NOT NULL,
  	"status" "enum_reports_status" DEFAULT 'draft' NOT NULL,
  	"summary" varchar,
  	"attachment_id" integer,
  	"cancellation_reason" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reports_id" integer;
  EXCEPTION WHEN duplicate_column THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "reports" ADD CONSTRAINT "reports_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "reports" ADD CONSTRAINT "reports_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "reports" ADD CONSTRAINT "reports_consultation_id_consultations_id_fk" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "reports" ADD CONSTRAINT "reports_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "reports" ADD CONSTRAINT "reports_attachment_id_media_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "reports_client_idx" ON "reports" USING btree ("client_id");
  CREATE INDEX IF NOT EXISTS "reports_doctor_idx" ON "reports" USING btree ("doctor_id");
  CREATE INDEX IF NOT EXISTS "reports_consultation_idx" ON "reports" USING btree ("consultation_id");
  CREATE INDEX IF NOT EXISTS "reports_appointment_idx" ON "reports" USING btree ("appointment_id");
  CREATE INDEX IF NOT EXISTS "reports_report_date_idx" ON "reports" USING btree ("report_date");
  CREATE INDEX IF NOT EXISTS "reports_report_type_idx" ON "reports" USING btree ("report_type");
  CREATE INDEX IF NOT EXISTS "reports_status_idx" ON "reports" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "reports_attachment_idx" ON "reports" USING btree ("attachment_id");
  CREATE INDEX IF NOT EXISTS "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "reports_created_at_idx" ON "reports" USING btree ("created_at");

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "reports" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reports_fk";
  
  DROP INDEX "payload_locked_documents_rels_reports_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reports_id";
  DROP TYPE "public"."enum_reports_report_type";
  DROP TYPE "public"."enum_reports_status";`)
}
