-- DropForeignKey
ALTER TABLE "Tenant_Page" DROP CONSTRAINT "Tenant_Page_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Page" DROP CONSTRAINT "User_Page_tenant_page_id_fkey";

-- AddForeignKey
ALTER TABLE "Tenant_Page" ADD CONSTRAINT "Tenant_Page_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Page" ADD CONSTRAINT "User_Page_tenant_page_id_fkey" FOREIGN KEY ("tenant_page_id") REFERENCES "Tenant_Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
