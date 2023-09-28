/*
  Warnings:

  - Added the required column `tenant_cnpj` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "tenant_cnpj" TEXT NOT NULL;
