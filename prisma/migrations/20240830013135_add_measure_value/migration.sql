/*
  Warnings:

  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Measure` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Measure" DROP CONSTRAINT "Measure_customer_code_fkey";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Measure";

-- CreateTable
CREATE TABLE "Measures" (
    "measure_uuid" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "image_url" TEXT NOT NULL,
    "customer_code" TEXT NOT NULL,

    CONSTRAINT "Measures_pkey" PRIMARY KEY ("measure_uuid")
);

-- CreateTable
CREATE TABLE "Customers" (
    "customer_code" TEXT NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("customer_code")
);

-- AddForeignKey
ALTER TABLE "Measures" ADD CONSTRAINT "Measures_customer_code_fkey" FOREIGN KEY ("customer_code") REFERENCES "Customers"("customer_code") ON DELETE RESTRICT ON UPDATE CASCADE;
