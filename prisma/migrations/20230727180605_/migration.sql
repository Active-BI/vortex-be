-- DropForeignKey
ALTER TABLE "Tenant_DashBoard" DROP CONSTRAINT "Tenant_DashBoard_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Tenant_DashBoard" DROP CONSTRAINT "User_Tenant_DashBoard_tenant_DashBoard_id_fkey";

-- AddForeignKey
ALTER TABLE "Tenant_DashBoard" ADD CONSTRAINT "Tenant_DashBoard_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Tenant_DashBoard" ADD CONSTRAINT "User_Tenant_DashBoard_tenant_DashBoard_id_fkey" FOREIGN KEY ("tenant_DashBoard_id") REFERENCES "Tenant_DashBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
