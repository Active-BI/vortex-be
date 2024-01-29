-- DropForeignKey
ALTER TABLE "User_Session_Hist" DROP CONSTRAINT "User_Session_Hist_email_fkey";

-- AddForeignKey
ALTER TABLE "User_Session_Hist" ADD CONSTRAINT "User_Session_Hist_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("contact_email") ON DELETE CASCADE ON UPDATE CASCADE;
