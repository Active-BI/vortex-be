/*
  Warnings:

  - Added the required column `type` to the `DashBoard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DashBoard" ADD COLUMN     "type" TEXT NOT NULL;
