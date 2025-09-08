import bcrypt from 'bcryptjs';
import {prisma} from '../libs/prisma'
import { Sexo, StatusSocio, TipoSangue } from '@prisma/client';

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
    numeroSocio?: number
}

export const nextNumberSocio = async () => {
  const reservado = [10, 12, 47];
  
  const socios = await prisma.socio.findMany({
    select: { nSocio: true },
    orderBy: { nSocio: "asc" }
  });
  
  const numerosExistentes = socios.map(s => s.nSocio);
  
  let numeroDisponivel = 1;
  
  while (true) {
    if (!numerosExistentes.includes(numeroDisponivel) && !reservado.includes(numeroDisponivel)) {
      return numeroDisponivel;
    }
    numeroDisponivel++;
  }
};

export const getSocioByNumero = async (nSocio: number) => {
    const socio = await prisma.socio.findUnique({
        where: {nSocio}
    });
    return socio;
}

export const createSocio = async ({ nomeCompleto, sexo, email, password, telemovel, tipoSangue, rua, nPorta, codigoPostal, freguesia, concelho, distrito, dataNascimento, responsavel, avatar, kitSocio, kitDate, grupoWhatsApp, grupoWhatsAppDate, status, numeroSocio }:CreateSocioProps) => {
  const reservado = [10, 12];
  let nSocio: number;
  
  if(numeroSocio) {
        if(reservado.includes(numeroSocio)){
          return { error: "Número de sócio está reservado" };
        }
        
        const verificaSocio = await getSocioByNumero(numeroSocio);
        if(verificaSocio){
          return { error: "Número de sócio já existe" };
        }
        
        nSocio = numeroSocio;
  } else {
        nSocio = await nextNumberSocio();
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
            kitDate: kitDate || (kitSocio ? new Date() : null),
            grupoWhatsApp,
            grupoWhatsAppDate: grupoWhatsAppDate || (grupoWhatsApp ? new Date() : null),
            status
        }
    });
};

export const getSocios = async () => {
    const result = await prisma.socio.findMany();
    return result;
};
