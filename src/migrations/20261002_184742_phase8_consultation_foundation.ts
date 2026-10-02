import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_consultations_consultation_type" AS ENUM('initial_examination', 'comprehensive_evaluation', 'treatment_planning', 'specialist_consult', 'clinical_review');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_consultations_status" AS ENUM('draft', 'completed', 'cancelled');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE TABLE IF NOT EXISTS "consultations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" integer NOT NULL,
  	"doctor_id" integer,
  	"appointment_id" integer,
  	"consultation_date" timestamp(3) with time zone NOT NULL,
  	"consultation_type" "enum_consultations_consultation_type" DEFAULT 'initial_examination' NOT NULL,
  	"status" "enum_consultations_status" DEFAULT 'draft' NOT NULL,
  	"chief_complaint" varchar,
  	"clinical_notes" varchar,
  	"recommendations" varchar,
  	"cancellation_reason" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consultations_id" integer;
  EXCEPTION WHEN duplicate_column THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "consultations" ADD CONSTRAINT "consultations_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "consultations" ADD CONSTRAINT "consultations_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "consultations" ADD CONSTRAINT "consultations_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "consultations_client_idx" ON "consultations" USING btree ("client_id");
  CREATE INDEX IF NOT EXISTS "consultations_doctor_idx" ON "consultations" USING btree ("doctor_id");
  CREATE INDEX IF NOT EXISTS "consultations_appointment_idx" ON "consultations" USING btree ("appointment_id");
  CREATE INDEX IF NOT EXISTS "consultations_consultation_date_idx" ON "consultations" USING btree ("consultation_date");
  CREATE INDEX IF NOT EXISTS "consultations_status_idx" ON "consultations" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "consultations_updated_at_idx" ON "consultations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "consultations_created_at_idx" ON "consultations" USING btree ("created_at");

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultations_fk" FOREIGN KEY ("consultations_id") REFERENCES "public"."consultations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_consultations_id_idx" ON "payload_locked_documents_rels" USING btree ("consultations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "consultations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "consultations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consultations_fk";
  
  DROP INDEX "payload_locked_documents_rels_consultations_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consultations_id";
  DROP TYPE "public"."enum_consultations_consultation_type";
  DROP TYPE "public"."enum_consultations_status";`)
}
