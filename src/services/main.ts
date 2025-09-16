import bcrypt from "bcryptjs";
import { getReservaByNum, nextNumberSocio } from "./admin";
import { prisma } from "../libs/prisma";
import { Sexo, StatusSocio, TipoSangue } from "@prisma/client";

type CreateSocioProps = {
    nomeCompleto: string,
    sexo: Sexo
    email: string
    password: string
    telemovel: string
    tipoSangue?: TipoSangue
    rua: string
    nPorta: string
    codigoPostal: string
    freguesia: string
    concelho: string
    distrito: string
    dataNascimento?: Date
    responsavel: string
    avatar?: string
    numeroSocio?: number
    kitSocio?: boolean
    kitDate?: Date
    grupoWhatsApp?: boolean
    grupoWhatsAppDate?: Date
    status?: StatusSocio
}

export const createSocioOff = async ({ nomeCompleto, sexo, email, password, telemovel, tipoSangue, rua, nPorta, codigoPostal, freguesia, concelho, distrito, dataNascimento, avatar}:CreateSocioProps) => {
  
let nSocio: number = await nextNumberSocio();
const reservado = await getReservaByNum(nSocio);
  
if (reservado) {
    return {error: "Número de sócio já tem uma reserva"};
  }

    email = email.toLowerCase();

    const newPassword = bcrypt.hashSync(password, 10);
  
    return await prisma.socio.create({
      data: {
        nSocio,
        nomeCompleto,
        sexo,
        email,
        password: newPassword,
        telemovel,
        tipoSangue: tipoSangue || "ND",
        rua,
        nPorta,
        codigoPostal,
        freguesia,
        concelho,
        distrito,
        dataNascimento,
        responsavel: "ND",
        avatar,
        kitSocio: false,
        kitDate: new Date(),
        grupoWhatsApp: false,
        grupoWhatsAppDate: new Date(),
        status: "ATIVO",
        role: "PARTNER",
      },
    });
};
