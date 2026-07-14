/*
  Warnings:

  - You are about to drop the column `filedLoginCount` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "filedLoginCount",
ADD COLUMN     "failedLoginCount" INTEGER NOT NULL DEFAULT 0;
