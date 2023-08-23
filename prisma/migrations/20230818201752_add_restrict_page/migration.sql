-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "restrict" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "restrict" BOOLEAN DEFAULT false;
