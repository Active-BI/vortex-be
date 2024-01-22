/*
  Warnings:

  - Added the required column `tenant_id` to the `Office` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "tenant_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
