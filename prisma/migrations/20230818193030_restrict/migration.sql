/*
  Warnings:

  - You are about to drop the column `restrict` on the `Tenant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "restrict" BOOLEAN;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "restrict";
