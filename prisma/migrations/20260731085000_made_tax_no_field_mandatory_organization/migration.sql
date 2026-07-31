/*
  Warnings:

  - Made the column `tax_number` on table `organization` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "organization" ALTER COLUMN "tax_number" SET NOT NULL;
