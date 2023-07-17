/*
  Warnings:

  - You are about to drop the `User_DashBoard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User_DashBoard" DROP CONSTRAINT "User_DashBoard_tenant_DashBoard_id_fkey";

-- DropForeignKey
ALTER TABLE "User_DashBoard" DROP CONSTRAINT "User_DashBoard_user_id_fkey";

-- DropTable
DROP TABLE "User_DashBoard";

-- CreateTable
CREATE TABLE "User_Tenant_DashBoard" (
    "id" UUID NOT NULL,
    "tenant_DashBoard_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "User_Tenant_DashBoard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User_Tenant_DashBoard" ADD CONSTRAINT "User_Tenant_DashBoard_tenant_DashBoard_id_fkey" FOREIGN KEY ("tenant_DashBoard_id") REFERENCES "Tenant_DashBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Tenant_DashBoard" ADD CONSTRAINT "User_Tenant_DashBoard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
