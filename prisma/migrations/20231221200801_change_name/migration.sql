/*
  Warnings:

  - You are about to drop the column `report_type` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "report_type",
ADD COLUMN     "page_type" TEXT;
