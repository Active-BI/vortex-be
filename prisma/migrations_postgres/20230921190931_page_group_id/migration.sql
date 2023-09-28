/*
  Warnings:

  - Made the column `page_group_id` on table `Page` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "page_group_id" SET NOT NULL;
