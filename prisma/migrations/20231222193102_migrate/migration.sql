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
