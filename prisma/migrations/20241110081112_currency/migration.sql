/*
  Warnings:

  - Added the required column `currency_id` to the `records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `default_currency_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "records" ADD COLUMN     "currency_id" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "default_currency_id" VARCHAR(36) NOT NULL;

-- CreateTable
CREATE TABLE "currencies" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "code" CHAR(3) NOT NULL,
    "symbol" VARCHAR(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_name_key" ON "currencies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_default_currency_id_fkey" FOREIGN KEY ("default_currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
