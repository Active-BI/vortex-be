-- CreateTable
CREATE TABLE "rh" (
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

    CONSTRAINT "rh_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rh" ADD CONSTRAINT "rh_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
