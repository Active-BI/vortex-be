/*
  Warnings:

  - You are about to drop the column `bocked` on the `Request_admin_access` table. All the data in the column will be lost.
  - Added the required column `blocked` to the `Request_admin_access` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request_admin_access" DROP COLUMN "bocked",
ADD COLUMN     "blocked" BOOLEAN NOT NULL;
