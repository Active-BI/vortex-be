/*
  Warnings:

  - You are about to drop the column `rls_id` on the `User_Auth` table. All the data in the column will be lost.
  - You are about to drop the `Rh_data` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rls_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rh_data" DROP CONSTRAINT "Rh_data_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Auth" DROP CONSTRAINT "User_Auth_rls_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rls_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "User_Auth" DROP COLUMN "rls_id";

-- DropTable
DROP TABLE "Rh_data";

-- CreateTable
CREATE TABLE "DashBoard" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DashBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant_DashBoard" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "dashboard_id" UUID NOT NULL,

    CONSTRAINT "Tenant_DashBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_DashBoard" (
    "id" UUID NOT NULL,
    "tenant_DashBoard_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "User_DashBoard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rls_id_fkey" FOREIGN KEY ("rls_id") REFERENCES "Rls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant_DashBoard" ADD CONSTRAINT "Tenant_DashBoard_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant_DashBoard" ADD CONSTRAINT "Tenant_DashBoard_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "DashBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_DashBoard" ADD CONSTRAINT "User_DashBoard_tenant_DashBoard_id_fkey" FOREIGN KEY ("tenant_DashBoard_id") REFERENCES "Tenant_DashBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_DashBoard" ADD CONSTRAINT "User_DashBoard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
