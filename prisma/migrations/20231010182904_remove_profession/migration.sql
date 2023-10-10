/*
  Warnings:

  - You are about to drop the column `description` on the `Request_admin_access` table. All the data in the column will be lost.
  - You are about to drop the column `profession` on the `Request_admin_access` table. All the data in the column will be lost.
  - You are about to drop the column `profession` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Request_admin_access" DROP COLUMN "description",
DROP COLUMN "profession";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profession";
