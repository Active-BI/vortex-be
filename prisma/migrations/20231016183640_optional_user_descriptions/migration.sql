-- DropForeignKey
ALTER TABLE "User_Page" DROP CONSTRAINT "User_Page_user_id_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User_Page" ADD CONSTRAINT "User_Page_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
