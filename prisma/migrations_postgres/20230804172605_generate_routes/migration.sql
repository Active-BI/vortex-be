/*
  Warnings:

  - You are about to drop the `DashBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant_DashBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_Tenant_DashBoard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tenant_DashBoard" DROP CONSTRAINT "Tenant_DashBoard_dashboard_id_fkey";

-- DropForeignKey
ALTER TABLE "Tenant_DashBoard" DROP CONSTRAINT "Tenant_DashBoard_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Tenant_DashBoard" DROP CONSTRAINT "User_Tenant_DashBoard_tenant_DashBoard_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Tenant_DashBoard" DROP CONSTRAINT "User_Tenant_DashBoard_user_id_fkey";

-- DropTable
DROP TABLE "DashBoard";

-- DropTable
DROP TABLE "Tenant_DashBoard";

-- DropTable
DROP TABLE "User_Tenant_DashBoard";

-- CreateTable
CREATE TABLE "Tenant_Page" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "page_id" UUID NOT NULL,

    CONSTRAINT "Tenant_Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Page" (
    "id" UUID NOT NULL,
    "tenant_page_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "User_Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page_Role" (
    "id" UUID NOT NULL,
    "page_id" UUID NOT NULL,
    "rls_id" UUID NOT NULL,

    CONSTRAINT "Page_Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page_Group" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Page_Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT,
    "group_id" TEXT,
    "report_id" TEXT,
    "table_name" TEXT,
    "page_group_id" UUID,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tenant_Page" ADD CONSTRAINT "Tenant_Page_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant_Page" ADD CONSTRAINT "Tenant_Page_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Page" ADD CONSTRAINT "User_Page_tenant_page_id_fkey" FOREIGN KEY ("tenant_page_id") REFERENCES "Tenant_Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Page" ADD CONSTRAINT "User_Page_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page_Role" ADD CONSTRAINT "Page_Role_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page_Role" ADD CONSTRAINT "Page_Role_rls_id_fkey" FOREIGN KEY ("rls_id") REFERENCES "Rls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_page_group_id_fkey" FOREIGN KEY ("page_group_id") REFERENCES "Page_Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
