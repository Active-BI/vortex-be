/*
  Warnings:

  - You are about to drop the column `normalized_personal_email` on the `User_Auth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User_Auth" DROP COLUMN "normalized_personal_email",
ADD COLUMN     "normalized_contact_email" TEXT;
