/*
  Warnings:

  - Added the required column `idle_expires_at` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session" ADD COLUMN     "idle_expires_at" TIMESTAMP(3) NOT NULL;
