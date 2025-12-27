/*
  Warnings:

  - You are about to alter the column `valor` on the `Quota` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[nSocio,ano]` on the table `Quota` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."eventStatus" AS ENUM ('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."AudienceType" AS ENUM ('SOCIO', 'NAO_SOCIO', 'CRIANCA');

-- CreateEnum
CREATE TYPE "public"."PriceTiming" AS ENUM ('EARLY', 'LATE', 'ONSITE');

-- CreateEnum
CREATE TYPE "public"."TipoParagem" AS ENUM ('START', 'BREAK', 'COFFEE', 'LUNCH', 'DINNER', 'SNACK', 'REFUEL', 'END');

-- CreateEnum
CREATE TYPE "public"."InscricaoStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "public"."PagamentoStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."PagamentoMetodo" AS ENUM ('CASH', 'MBWAY', 'TRANSFER', 'CARD', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Quota" ALTER COLUMN "valor" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "public"."Evento" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventSubtype" TEXT NOT NULL,
    "eventStatus" "public"."eventStatus" NOT NULL DEFAULT 'SCHEDULED',
    "description" TEXT,
    "registrationDateStart" TIMESTAMP(3) NOT NULL,
    "registrationDateEnd" TIMESTAMP(3) NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "locationStart" TEXT NOT NULL,
    "locationStops" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "locationEnd" TEXT NOT NULL,
    "moeda" TEXT NOT NULL DEFAULT 'EUR',
    "priceSocio" DECIMAL(10,2),
    "priceNaoSocio" DECIMAL(10,2),
    "minCilindrada" INTEGER,
    "maxCilindrada" INTEGER,
    "categoriasPermitidas" "public"."CategoriaMota"[] DEFAULT ARRAY[]::"public"."CategoriaMota"[],
    "categoriasProibidas" "public"."CategoriaMota"[] DEFAULT ARRAY[]::"public"."CategoriaMota"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Paragem" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,
    "tipo" "public"."TipoParagem" NOT NULL,
    "nome" TEXT,
    "descricao" TEXT,
    "enderecoLinha1" TEXT,
    "enderecoLinha2" TEXT,
    "localidade" TEXT,
    "distrito" TEXT,
    "codigoPostal" TEXT,
    "pais" TEXT DEFAULT 'Portugal',
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "placeId" TEXT,
    "chegadaPlaneada" TIMESTAMP(3),
    "pausaMinutos" INTEGER,
    "saidaPlaneada" TIMESTAMP(3),
    "distanciaKmPrev" DECIMAL(6,2),
    "duracaoMinPrev" INTEGER,

    CONSTRAINT "Paragem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Recurso" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Recurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ParagemRecurso" (
    "paragemId" INTEGER NOT NULL,
    "recursoId" INTEGER NOT NULL,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "quantidade" INTEGER,
    "custo" DECIMAL(10,2),
    "nota" TEXT,

    CONSTRAINT "ParagemRecurso_pkey" PRIMARY KEY ("paragemId","recursoId")
);

-- CreateTable
CREATE TABLE "public"."Estilo" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Estilo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventoEstilo" (
    "eventoId" INTEGER NOT NULL,
    "estiloId" INTEGER NOT NULL,

    CONSTRAINT "EventoEstilo_pkey" PRIMARY KEY ("eventoId","estiloId")
);

-- CreateTable
CREATE TABLE "public"."EventPriceTier" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "audience" "public"."AudienceType" NOT NULL,
    "timing" "public"."PriceTiming" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "nota" TEXT,

    CONSTRAINT "EventPriceTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inscricao" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "socioId" INTEGER NOT NULL,
    "motoId" INTEGER,
    "status" "public"."InscricaoStatus" NOT NULL DEFAULT 'PENDING',
    "audience" "public"."AudienceType" NOT NULL,
    "precoAplicado" DECIMAL(10,2) NOT NULL,
    "moeda" TEXT NOT NULL DEFAULT 'EUR',
    "pagamentoStatus" "public"."PagamentoStatus" NOT NULL DEFAULT 'PENDING',
    "pagamentoMetodo" "public"."PagamentoMetodo",
    "pagoEm" TIMESTAMP(3),
    "motoMarca" TEXT,
    "motoModelo" TEXT,
    "motoCilindrada" INTEGER,
    "motoMatricula" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inscricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventoRegraCategoria" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "categoria" "public"."CategoriaMota" NOT NULL,
    "minCilindrada" INTEGER,
    "maxCilindrada" INTEGER,
    "mensagem" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EventoRegraCategoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Paragem_eventoId_idx" ON "public"."Paragem"("eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "Paragem_eventoId_ordem_key" ON "public"."Paragem"("eventoId", "ordem");

-- CreateIndex
CREATE UNIQUE INDEX "Recurso_codigo_key" ON "public"."Recurso"("codigo");

-- CreateIndex
CREATE INDEX "ParagemRecurso_recursoId_idx" ON "public"."ParagemRecurso"("recursoId");

-- CreateIndex
CREATE UNIQUE INDEX "Estilo_codigo_key" ON "public"."Estilo"("codigo");

-- CreateIndex
CREATE INDEX "EventoEstilo_estiloId_idx" ON "public"."EventoEstilo"("estiloId");

-- CreateIndex
CREATE INDEX "EventPriceTier_eventoId_audience_timing_idx" ON "public"."EventPriceTier"("eventoId", "audience", "timing");

-- CreateIndex
CREATE UNIQUE INDEX "EventPriceTier_eventoId_audience_timing_key" ON "public"."EventPriceTier"("eventoId", "audience", "timing");

-- CreateIndex
CREATE INDEX "Inscricao_socioId_idx" ON "public"."Inscricao"("socioId");

-- CreateIndex
CREATE INDEX "Inscricao_eventoId_idx" ON "public"."Inscricao"("eventoId");

-- CreateIndex
CREATE INDEX "Inscricao_motoId_idx" ON "public"."Inscricao"("motoId");

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_eventoId_socioId_key" ON "public"."Inscricao"("eventoId", "socioId");

-- CreateIndex
CREATE INDEX "EventoRegraCategoria_eventoId_idx" ON "public"."EventoRegraCategoria"("eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "EventoRegraCategoria_eventoId_categoria_key" ON "public"."EventoRegraCategoria"("eventoId", "categoria");

-- CreateIndex
CREATE INDEX "Quota_nSocio_idx" ON "public"."Quota"("nSocio");

-- CreateIndex
CREATE UNIQUE INDEX "Quota_nSocio_ano_key" ON "public"."Quota"("nSocio", "ano");

-- AddForeignKey
ALTER TABLE "public"."Paragem" ADD CONSTRAINT "Paragem_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParagemRecurso" ADD CONSTRAINT "ParagemRecurso_paragemId_fkey" FOREIGN KEY ("paragemId") REFERENCES "public"."Paragem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParagemRecurso" ADD CONSTRAINT "ParagemRecurso_recursoId_fkey" FOREIGN KEY ("recursoId") REFERENCES "public"."Recurso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventoEstilo" ADD CONSTRAINT "EventoEstilo_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventoEstilo" ADD CONSTRAINT "EventoEstilo_estiloId_fkey" FOREIGN KEY ("estiloId") REFERENCES "public"."Estilo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventPriceTier" ADD CONSTRAINT "EventPriceTier_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscricao" ADD CONSTRAINT "Inscricao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscricao" ADD CONSTRAINT "Inscricao_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "public"."Socio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscricao" ADD CONSTRAINT "Inscricao_motoId_fkey" FOREIGN KEY ("motoId") REFERENCES "public"."Mota"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventoRegraCategoria" ADD CONSTRAINT "EventoRegraCategoria_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
