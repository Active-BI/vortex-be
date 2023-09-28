-- CreateTable
CREATE TABLE "Request_admin_access" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "request_description" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,

    CONSTRAINT "Request_admin_access_pkey" PRIMARY KEY ("id")
);
