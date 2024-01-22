/*
  Warnings:

  - You are about to drop the `User_Office` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User_Office" DROP CONSTRAINT "User_Office_office_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Office" DROP CONSTRAINT "User_Office_user_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "office_id" TEXT;

-- DropTable
DROP TABLE "User_Office";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_office_id_fkey" FOREIGN KEY ("office_id") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;
