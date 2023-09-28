/*
  Warnings:

  - The primary key for the `DashBoard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DashBoard` table. All the data in the column will be lost.
  - Added the required column `group_id` to the `DashBoard` table without a default value. This is not possible if the table is not empty.
  - The required column `report_id` was added to the `DashBoard` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Tenant_DashBoard" DROP CONSTRAINT "Tenant_DashBoard_dashboard_id_fkey";

-- AlterTable
ALTER TABLE "DashBoard" DROP CONSTRAINT "DashBoard_pkey",
DROP COLUMN "id",
ADD COLUMN     "group_id" TEXT NOT NULL,
ADD COLUMN     "report_id" UUID NOT NULL,
ADD CONSTRAINT "DashBoard_pkey" PRIMARY KEY ("report_id");

-- AddForeignKey
ALTER TABLE "Tenant_DashBoard" ADD CONSTRAINT "Tenant_DashBoard_dashboard_id_fkey" FOREIGN KEY ("dashboard_id") REFERENCES "DashBoard"("report_id") ON DELETE RESTRICT ON UPDATE CASCADE;
