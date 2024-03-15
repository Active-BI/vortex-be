/*
  Warnings:

  - You are about to drop the `Request_admin_access` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Request_admin_access" DROP CONSTRAINT "Request_admin_access_tenant_id_fkey";

-- DropTable
DROP TABLE "Request_admin_access";
