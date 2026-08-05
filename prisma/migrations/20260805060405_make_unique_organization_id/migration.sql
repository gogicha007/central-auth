/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,name]` on the table `role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "role_organization_id_name_key" ON "role"("organization_id", "name");
