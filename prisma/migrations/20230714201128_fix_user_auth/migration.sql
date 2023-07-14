/*
  Warnings:

  - Added the required column `user_id` to the `User_Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_Auth" ADD COLUMN     "user_id" UUID NOT NULL,
ALTER COLUMN "personal_email" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User_Auth" ADD CONSTRAINT "User_Auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
