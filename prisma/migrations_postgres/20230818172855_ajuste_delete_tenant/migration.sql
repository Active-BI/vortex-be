-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rls_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Page" DROP CONSTRAINT "User_Page_tenant_page_id_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rls_id_fkey" FOREIGN KEY ("rls_id") REFERENCES "Rls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Page" ADD CONSTRAINT "User_Page_tenant_page_id_fkey" FOREIGN KEY ("tenant_page_id") REFERENCES "Tenant_Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
