import bcrypt from 'bcryptjs';
import {prisma} from '../libs/prisma'
import { Sexo, StatusSocio, TipoSangue } from '@prisma/client';

/*
  id Int @id @default(autoincrement())
  nSocio Int @unique
  nomeCompleto String
  sexo Sexo 
  email String @unique
  telemovel String
  tipoSangue TipoSangue @default(ND)
  rua String
  nPorta String
  codigoPostal String
  freguesia String
  concelho String
  distrito String
  dataEntrada DateTime @default(now())
  dataNascimento DateTime?
  responsavel String
  updatedAt DateTime @updatedAt
  avatar String @default("public/images/avatares/default.jpeg")
  kitSocio Boolean @default(false)
  kitDate DateTime?
  grupoWhatsApp Boolean @default(false)
  grupoWhatsAppDate DateTime?
  status StatusSocio @default(ATIVO)§
*/

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
    kitSocio?: boolean
    kitDate?: Date
    grupoWhatsApp?: boolean
    grupoWhatsAppDate?: Date
    status?: StatusSocio
}

export const nextNumberSocio = async () => {
  const reservado = [10, 12];

  const lastSocio = await prisma.socio.findFirst({
    orderBy: {nSocio: "desc"},
  });

  if (!lastSocio) {
    return 1;
  }

  let proximoNumero = lastSocio.nSocio + 1;

  while (reservado.includes(proximoNumero)) {
    proximoNumero++;
  }

  return proximoNumero;
};

export const createSocio = async ({ nomeCompleto, sexo, email, password, telemovel, tipoSangue, rua, nPorta, codigoPostal, freguesia, concelho, distrito, dataNascimento, responsavel, avatar, kitSocio, kitDate, grupoWhatsApp, grupoWhatsAppDate, status }:CreateSocioProps) => {
    const nSocio = await nextNumberSocio();
    
    const socio = await prisma.socio.findFirst({
        where: {nSocio: nSocio}
    });

    if(socio) return false;
    
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
            tipoSangue: tipoSangue || 'ND', 
            rua, 
            nPorta, 
            codigoPostal, 
            freguesia, 
            concelho, 
            distrito, 
            dataNascimento, 
            responsavel,
            avatar,
            kitSocio,
            kitDate,
            grupoWhatsApp,
            grupoWhatsAppDate,
            status
        }
    });
};


