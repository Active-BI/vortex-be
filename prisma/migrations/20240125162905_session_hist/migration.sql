/*
  Warnings:

  - You are about to drop the column `status` on the `User_Session_Hist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User_Session_Hist" DROP COLUMN "status",
ADD COLUMN     "exited_at" TIMESTAMP(3);
