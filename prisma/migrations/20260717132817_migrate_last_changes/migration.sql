/*
  Warnings:

  - You are about to drop the column `last_seen` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "last_seen",
ADD COLUMN     "last_login_at" TIMESTAMP(3);
