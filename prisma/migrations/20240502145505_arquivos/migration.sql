-- CreateTable
CREATE TABLE "Tenant_files" (
    "id" UUID NOT NULL DEFAULT public.uuid_generate_v4(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255),
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_date" TIMESTAMP(6),
    "name" VARCHAR(255) NOT NULL,
    "file" BYTEA NOT NULL,
    "file_format" VARCHAR NOT NULL,
    "projects" TEXT[],
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "Tenant_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tenant_files" ADD CONSTRAINT "Tenant_files_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
