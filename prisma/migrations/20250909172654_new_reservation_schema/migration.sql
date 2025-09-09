/*
  Warnings:

  - The `descricao` column on the `Reserva` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."DescriptionReserva" AS ENUM ('OLD_PARTNER', 'NO_PAY', 'EXPELLED', 'EVENT', 'HONOR', 'CUSTOM');

-- AlterTable
ALTER TABLE "public"."Reserva" ADD COLUMN     "note" TEXT,
DROP COLUMN "descricao",
ADD COLUMN     "descricao" "public"."DescriptionReserva";
