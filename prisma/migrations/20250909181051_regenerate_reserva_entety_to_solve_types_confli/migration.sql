/*
  Warnings:

  - A unique constraint covering the columns `[nSocio]` on the table `Reserva` will be added. If there are existing duplicate values, this will fail.
  - Made the column `descricao` on table `Reserva` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Reserva" ALTER COLUMN "descricao" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_nSocio_key" ON "public"."Reserva"("nSocio");
