-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_page_group_id_fkey";

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_page_group_id_fkey" FOREIGN KEY ("page_group_id") REFERENCES "Page_Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
