-- DropForeignKey
ALTER TABLE "Tenant_Page" DROP CONSTRAINT "Tenant_Page_page_id_fkey";

-- AddForeignKey
ALTER TABLE "Tenant_Page" ADD CONSTRAINT "Tenant_Page_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
