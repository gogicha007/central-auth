/*
  Warnings:

  - The values [SUPERADMIN] on the enum `RoleNames` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleNames_new" AS ENUM ('ADMIN', 'MANAGER', 'DIRECTOR', 'EMPLOYEE', 'VIEWER');
ALTER TABLE "public"."role" ALTER COLUMN "name" DROP DEFAULT;
ALTER TABLE "role" ALTER COLUMN "name" TYPE "RoleNames_new" USING ("name"::text::"RoleNames_new");
ALTER TYPE "RoleNames" RENAME TO "RoleNames_old";
ALTER TYPE "RoleNames_new" RENAME TO "RoleNames";
DROP TYPE "public"."RoleNames_old";
ALTER TABLE "role" ALTER COLUMN "name" SET DEFAULT 'VIEWER';
COMMIT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "is_platform_admin" BOOLEAN NOT NULL DEFAULT false;
