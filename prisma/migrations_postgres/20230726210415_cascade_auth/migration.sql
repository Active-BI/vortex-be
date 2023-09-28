-- DropForeignKey
ALTER TABLE "User_Auth" DROP CONSTRAINT "User_Auth_user_id_fkey";

-- AddForeignKey
ALTER TABLE "User_Auth" ADD CONSTRAINT "User_Auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
