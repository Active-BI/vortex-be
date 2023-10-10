-- CreateTable
CREATE TABLE "Rls" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Rls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "tenant_name" TEXT NOT NULL,
    "tenant_cnpj" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "restrict" BOOLEAN DEFAULT false,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request_admin_access" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_description" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tenant_id" TEXT,
    "description" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "accept" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Request_admin_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Auth" (
    "id" TEXT NOT NULL,
    "secret" TEXT,
    "reset_pass" TEXT,
    "password_hash" TEXT,
    "anchor" BOOLEAN NOT NULL,
    "normalized_contact_email" TEXT,
    "last_access" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "User_Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "born_date" DATE,
    "personal_email" TEXT,
    "contact_email" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tenant_id" TEXT,
    "rls_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant_Page" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,

    CONSTRAINT "Tenant_Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Page" (
    "id" TEXT NOT NULL,
    "tenant_page_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "User_Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page_Role" (
    "id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "rls_id" TEXT NOT NULL,

    CONSTRAINT "Page_Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page_Group" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "formated_title" TEXT,
    "restrict" BOOLEAN DEFAULT false,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Page_Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "report_type" TEXT,
    "formated_title" TEXT,
    "title" TEXT NOT NULL,
    "descricao_painel" TEXT,
    "responsavel" TEXT,
    "link" TEXT,
    "group_id" TEXT,
    "report_id" TEXT,
    "possui_dados_sensiveis" BOOLEAN DEFAULT false,
    "restrict" BOOLEAN DEFAULT false,
    "table_name" TEXT,
    "page_group_id" TEXT NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcionarios_table" (
    "id" TEXT NOT NULL,
    "nomeEmpresa" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargos" TEXT NOT NULL,
    "dataAdmissao" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "salario" DOUBLE PRECISION NOT NULL,
    "sexo" TEXT NOT NULL,
    "cutis" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "vinculoEmpregaticio" TEXT NOT NULL,
    "situacaoEmpregado" TEXT NOT NULL,
    "grauInstrucao" TEXT NOT NULL,
    "pcd" TEXT NOT NULL,
    "desligado" TEXT NOT NULL,
    "dataDesligamento" TIMESTAMP(3),
    "motivoDesligamento" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_id" TEXT NOT NULL,

    CONSTRAINT "funcionarios_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Auth_user_id_key" ON "User_Auth"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_personal_email_key" ON "User"("personal_email");

-- AddForeignKey
ALTER TABLE "Request_admin_access" ADD CONSTRAINT "Request_admin_access_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Auth" ADD CONSTRAINT "User_Auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rls_id_fkey" FOREIGN KEY ("rls_id") REFERENCES "Rls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant_Page" ADD CONSTRAINT "Tenant_Page_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant_Page" ADD CONSTRAINT "Tenant_Page_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Page" ADD CONSTRAINT "User_Page_tenant_page_id_fkey" FOREIGN KEY ("tenant_page_id") REFERENCES "Tenant_Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Page" ADD CONSTRAINT "User_Page_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Page_Role" ADD CONSTRAINT "Page_Role_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page_Role" ADD CONSTRAINT "Page_Role_rls_id_fkey" FOREIGN KEY ("rls_id") REFERENCES "Rls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_page_group_id_fkey" FOREIGN KEY ("page_group_id") REFERENCES "Page_Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionarios_table" ADD CONSTRAINT "funcionarios_table_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
