/*
  Warnings:

  - You are about to drop the column `app_image` on the `Tenant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "app_image";

-- CreateTable
CREATE TABLE "app" (
    "id" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "bg_image" TEXT NOT NULL,
    "bg_color" TEXT NOT NULL,

    CONSTRAINT "app_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_id_key" ON "app"("id");
