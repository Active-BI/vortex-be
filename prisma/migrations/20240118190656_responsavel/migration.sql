/*
  Warnings:

  - You are about to drop the column `responsavel` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "responsavel",
ADD COLUMN     "email_responsavel" TEXT,
ADD COLUMN     "nome_responsavel" TEXT;
