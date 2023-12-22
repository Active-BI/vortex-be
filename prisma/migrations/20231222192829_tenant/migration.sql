/*
  Warnings:

  - You are about to drop the `funcionarios_table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "funcionarios_table" DROP CONSTRAINT "funcionarios_table_tenant_id_fkey";

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "company_description" TEXT;

-- DropTable
DROP TABLE "funcionarios_table";
