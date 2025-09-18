/*
  Warnings:

  - You are about to drop the column `celindrada` on the `Mota` table. All the data in the column will be lost.
  - The `ano` column on the `Mota` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `cilindrada` to the `Mota` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CategoriaMota" AS ENUM ('ND', 'SCOOTER', 'NAKED', 'CUSTOM', 'SPORT', 'TOURING', 'TRAIL', 'OFF_ROAD');

-- AlterTable
ALTER TABLE "public"."Mota" DROP COLUMN "celindrada",
ADD COLUMN     "categoria" "public"."CategoriaMota",
ADD COLUMN     "cilindrada" INTEGER NOT NULL,
ALTER COLUMN "matricula" DROP NOT NULL,
DROP COLUMN "ano",
ADD COLUMN     "ano" INTEGER,
ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT 'public/images/motas/defaultMoto.jpg';
