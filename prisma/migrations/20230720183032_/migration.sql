/*
  Warnings:

  - A unique constraint covering the columns `[personal_email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `anchor` to the `User_Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_Auth" ADD COLUMN     "anchor" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_personal_email_key" ON "User"("personal_email");
