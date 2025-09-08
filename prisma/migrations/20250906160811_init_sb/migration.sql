-- CreateEnum
CREATE TYPE "public"."Sexo" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."TipoSangue" AS ENUM ('ND', 'A_POSITIVO', 'A_NEGATIVO', 'B_POSITIVO', 'B_NEGATIVO', 'AB_POSITIVO', 'AB_NEGATIVO', 'O_POSITIVO', 'O_NEGATIVO');

-- CreateEnum
CREATE TYPE "public"."StatusSocio" AS ENUM ('ATIVO', 'INATIVO', 'SUSPENSO', 'HONORARIO');

-- CreateTable
CREATE TABLE "public"."Socio" (
    "id" SERIAL NOT NULL,
    "nSocio" INTEGER NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "sexo" "public"."Sexo" NOT NULL,
    "email" TEXT NOT NULL,
    "telemovel" TEXT NOT NULL,
    "tipoSangue" "public"."TipoSangue" NOT NULL DEFAULT 'ND',
    "rua" TEXT NOT NULL,
    "nPorta" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "freguesia" TEXT NOT NULL,
    "concelho" TEXT NOT NULL,
    "distrito" TEXT NOT NULL,
    "dataEntrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataNascimento" TIMESTAMP(3),
    "responsavel" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'public/images/avatares/default.jpeg',
    "kitSocio" BOOLEAN NOT NULL DEFAULT false,
    "kitDate" TIMESTAMP(3),
    "grupoWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "grupoWhatsAppDate" TIMESTAMP(3),
    "status" "public"."StatusSocio" NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mota" (
    "id" SERIAL NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "celindrada" INTEGER NOT NULL,
    "matricula" TEXT NOT NULL,
    "ano" TIMESTAMP(3) NOT NULL,
    "avatar" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quota" (
    "id" SERIAL NOT NULL,
    "nSocio" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" INTEGER NOT NULL,
    "payedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MotaToSocio" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MotaToSocio_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Socio_nSocio_key" ON "public"."Socio"("nSocio");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_email_key" ON "public"."Socio"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mota_matricula_key" ON "public"."Mota"("matricula");

-- CreateIndex
CREATE INDEX "_MotaToSocio_B_index" ON "public"."_MotaToSocio"("B");

-- AddForeignKey
ALTER TABLE "public"."Quota" ADD CONSTRAINT "Quota_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MotaToSocio" ADD CONSTRAINT "_MotaToSocio_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Mota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MotaToSocio" ADD CONSTRAINT "_MotaToSocio_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Socio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
