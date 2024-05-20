/*
  Warnings:

  - You are about to drop the column `personal_email` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_personal_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "personal_email";
