import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_appointments_appointment_type" AS ENUM('consultation', 'treatment', 'followup', 'routine_checkup', 'emergency');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_appointments_status" AS ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE TABLE IF NOT EXISTS "appointments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_id" integer NOT NULL,
  	"doctor_id" integer,
  	"service_id" integer,
  	"date_time" timestamp(3) with time zone NOT NULL,
  	"appointment_type" "enum_appointments_appointment_type" DEFAULT 'consultation' NOT NULL,
  	"status" "enum_appointments_status" DEFAULT 'scheduled' NOT NULL,
  	"duration" numeric DEFAULT 30,
  	"notes" varchar,
  	"cancellation_reason" varchar,
  	"follow_up_required" boolean DEFAULT false,
  	"follow_up_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "appointments_id" integer;
  EXCEPTION WHEN duplicate_column THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "appointments" ADD CONSTRAINT "appointments_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "appointments_client_idx" ON "appointments" USING btree ("client_id");
  CREATE INDEX IF NOT EXISTS "appointments_doctor_idx" ON "appointments" USING btree ("doctor_id");
  CREATE INDEX IF NOT EXISTS "appointments_service_idx" ON "appointments" USING btree ("service_id");
  CREATE INDEX IF NOT EXISTS "appointments_date_time_idx" ON "appointments" USING btree ("date_time");
  CREATE INDEX IF NOT EXISTS "appointments_status_idx" ON "appointments" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "appointments_updated_at_idx" ON "appointments" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "appointments_created_at_idx" ON "appointments" USING btree ("created_at");

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_appointments_fk" FOREIGN KEY ("appointments_id") REFERENCES "public"."appointments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_appointments_id_idx" ON "payload_locked_documents_rels" USING btree ("appointments_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "appointments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "appointments" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_appointments_fk";
  
  DROP INDEX "payload_locked_documents_rels_appointments_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "appointments_id";
  DROP TYPE "public"."enum_appointments_appointment_type";
  DROP TYPE "public"."enum_appointments_status";`)
}
