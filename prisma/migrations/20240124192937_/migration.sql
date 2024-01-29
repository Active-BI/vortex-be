/*
  Warnings:

  - A unique constraint covering the columns `[contact_email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "User_Session_Hist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "User_Session_Hist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_contact_email_key" ON "User"("contact_email");

-- AddForeignKey
ALTER TABLE "User_Session_Hist" ADD CONSTRAINT "User_Session_Hist_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("contact_email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Session_Hist" ADD CONSTRAINT "User_Session_Hist_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
