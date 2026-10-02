import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_email_outbox_status" AS ENUM('pending', 'processing', 'sent', 'failed');
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE TABLE IF NOT EXISTS "email_outbox" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"to" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"html" varchar NOT NULL,
  	"text" varchar,
  	"reference_id" varchar,
  	"status" "enum_email_outbox_status" DEFAULT 'pending' NOT NULL,
  	"attempts" numeric DEFAULT 0 NOT NULL,
  	"last_error" varchar,
  	"next_retry_at" timestamp(3) with time zone,
  	"sent_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "email_outbox_id" integer;
  EXCEPTION WHEN duplicate_column THEN null; END $$;

  CREATE UNIQUE INDEX IF NOT EXISTS "email_outbox_reference_id_idx" ON "email_outbox" USING btree ("reference_id");
  CREATE INDEX IF NOT EXISTS "email_outbox_status_idx" ON "email_outbox" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "email_outbox_next_retry_at_idx" ON "email_outbox" USING btree ("next_retry_at");
  CREATE INDEX IF NOT EXISTS "email_outbox_updated_at_idx" ON "email_outbox" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "email_outbox_created_at_idx" ON "email_outbox" USING btree ("created_at");

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_outbox_fk" FOREIGN KEY ("email_outbox_id") REFERENCES "public"."email_outbox"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_email_outbox_id_idx" ON "payload_locked_documents_rels" USING btree ("email_outbox_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "email_outbox" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "email_outbox" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_email_outbox_fk";
  
  DROP INDEX "payload_locked_documents_rels_email_outbox_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "email_outbox_id";
  DROP TYPE "public"."enum_email_outbox_status";`)
}
