/*
  Warnings:

  - You are about to drop the column `request_description` on the `Request_admin_access` table. All the data in the column will be lost.
  - Added the required column `company_cnpj` to the `Request_admin_access` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_description` to the `Request_admin_access` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Request_admin_access` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Request_admin_access` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request_admin_access" DROP COLUMN "request_description",
ADD COLUMN     "company_cnpj" TEXT NOT NULL,
ADD COLUMN     "company_description" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "tenant_id" UUID,
ALTER COLUMN "blocked" SET DEFAULT false,
ALTER COLUMN "accept" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "Request_admin_access" ADD CONSTRAINT "Request_admin_access_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
