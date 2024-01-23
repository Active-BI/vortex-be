-- CreateTable
CREATE TABLE "UserInOut" (
    "id" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "data" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "UserInOut_pkey" PRIMARY KEY ("id")
);
