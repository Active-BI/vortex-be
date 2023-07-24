/*
  Warnings:

  - Added the required column `accept` to the `Request_admin_access` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request_admin_access" ADD COLUMN     "accept" BOOLEAN NOT NULL;
