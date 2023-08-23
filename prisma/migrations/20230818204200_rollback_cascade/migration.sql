-- DropForeignKey
ALTER TABLE "Tenant_Page" DROP CONSTRAINT "Tenant_Page_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rls_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Auth" DROP CONSTRAINT "User_Auth_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Page" DROP CONSTRAINT "User_Page_tenant_page_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Page" DROP CONSTRAINT "User_Page_user_id_fkey";

-- DropForeignKey
ALTER TABLE "rh_funcionarios_table" DROP CONSTRAINT "rh_funcionarios_table_tenant_id_fkey";

-- AddForeignKey
ALTER TABLE "User_Auth" ADD CONSTRAINT "User_Auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rls_id_fkey" FOREIGN KEY ("rls_id") REFERENCES "Rls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant_Page" ADD CONSTRAINT "Tenant_Page_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Page" ADD CONSTRAINT "User_Page_tenant_page_id_fkey" FOREIGN KEY ("tenant_page_id") REFERENCES "Tenant_Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Page" ADD CONSTRAINT "User_Page_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rh_funcionarios_table" ADD CONSTRAINT "rh_funcionarios_table_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
