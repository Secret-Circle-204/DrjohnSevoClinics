import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "inquiries" SET "email" = 'reception@drjohnsevo.com' WHERE "email" IS NULL;
    ALTER TABLE "inquiries" ALTER COLUMN "email" SET NOT NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "inquiries" ALTER COLUMN "email" DROP NOT NULL;
  `)
}
