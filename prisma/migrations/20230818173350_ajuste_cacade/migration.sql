-- DropForeignKey
ALTER TABLE "User_Page" DROP CONSTRAINT "User_Page_tenant_page_id_fkey";

-- AddForeignKey
ALTER TABLE "User_Page" ADD CONSTRAINT "User_Page_tenant_page_id_fkey" FOREIGN KEY ("tenant_page_id") REFERENCES "Tenant_Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
