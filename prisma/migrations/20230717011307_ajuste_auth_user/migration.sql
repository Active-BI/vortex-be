/*
  Warnings:

  - You are about to drop the column `nome` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rls_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `contact_email` on the `User_Auth` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User_Auth` table. All the data in the column will be lost.
  - You are about to drop the column `personal_email` on the `User_Auth` table. All the data in the column will be lost.
  - You are about to drop the `RH_data` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalized_personal_email` to the `User_Auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rls_id` to the `User_Auth` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RH_data" DROP CONSTRAINT "RH_data_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rls_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nome",
DROP COLUMN "rls_id",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User_Auth" DROP COLUMN "contact_email",
DROP COLUMN "name",
DROP COLUMN "personal_email",
ADD COLUMN     "normalized_personal_email" TEXT NOT NULL,
ADD COLUMN     "rls_id" UUID NOT NULL,
ALTER COLUMN "secret" DROP NOT NULL,
ALTER COLUMN "reset_pass" DROP NOT NULL,
ALTER COLUMN "password_hash" DROP NOT NULL,
ALTER COLUMN "last_access" DROP NOT NULL;

-- DropTable
DROP TABLE "RH_data";

-- CreateTable
CREATE TABLE "Rh_data" (
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

    CONSTRAINT "Rh_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User_Auth" ADD CONSTRAINT "User_Auth_rls_id_fkey" FOREIGN KEY ("rls_id") REFERENCES "Rls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rh_data" ADD CONSTRAINT "Rh_data_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
