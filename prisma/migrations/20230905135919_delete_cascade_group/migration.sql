-- DropForeignKey
ALTER TABLE "Page_Role" DROP CONSTRAINT "Page_Role_page_id_fkey";

-- AddForeignKey
ALTER TABLE "Page_Role" ADD CONSTRAINT "Page_Role_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
