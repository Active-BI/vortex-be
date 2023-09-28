-- CreateTable
CREATE TABLE "Rls" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Rls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL,
    "tenant_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Auth" (
    "id" UUID NOT NULL,
    "secret" TEXT NOT NULL,
    "reset_pass" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "personal_email" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "last_access" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "User_Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "born_date" DATE NOT NULL,
    "personal_email" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tenant_id" UUID NOT NULL,
    "rls_id" UUID NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "social_name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL,
    "Telefone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenant_id" UUID NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RH_data" (
    "id" UUID NOT NULL,
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
    "pcd" BOOLEAN NOT NULL,
    "desligado" BOOLEAN NOT NULL,
    "dataDesligamento" TIMESTAMP(3),
    "motivoDesligamento" TEXT,
    "tenant_id" UUID NOT NULL,

    CONSTRAINT "RH_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rls_id_fkey" FOREIGN KEY ("rls_id") REFERENCES "Rls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RH_data" ADD CONSTRAINT "RH_data_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
