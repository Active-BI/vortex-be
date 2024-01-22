-- CreateTable
CREATE TABLE "Office" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Office" (
    "id" TEXT NOT NULL,
    "office_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "User_Office_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User_Office" ADD CONSTRAINT "User_Office_office_id_fkey" FOREIGN KEY ("office_id") REFERENCES "Office"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Office" ADD CONSTRAINT "User_Office_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
