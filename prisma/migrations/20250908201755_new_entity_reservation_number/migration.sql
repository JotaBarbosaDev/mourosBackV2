-- CreateTable
CREATE TABLE "public"."Reserva" (
    "id" SERIAL NOT NULL,
    "nSocio" INTEGER NOT NULL,
    "dataReserva" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);
