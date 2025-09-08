/*
  Warnings:

  - Added the required column `password` to the `Socio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Socio" ADD COLUMN     "password" TEXT NOT NULL;
