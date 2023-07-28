-- DropForeignKey
ALTER TABLE "rh_funcionarios_table" DROP CONSTRAINT "rh_funcionarios_table_tenant_id_fkey";

-- AddForeignKey
ALTER TABLE "rh_funcionarios_table" ADD CONSTRAINT "rh_funcionarios_table_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
