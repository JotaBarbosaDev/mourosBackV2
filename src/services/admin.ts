import bcrypt from 'bcryptjs';
import {prisma} from '../libs/prisma'
import { DescriptionReserva, Sexo, StatusSocio, TipoSangue, Role, Socio } from '@prisma/client';
import { deleteMotoById } from '../controllers/admin';

type CreateSocioProps = {
    role: Role,
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
    status: StatusSocio
    numeroSocio?: number
}

type ReservaProps = {
    nSocio: number,
    descricao: DescriptionReserva,
    note?: string
}

type CreateMotoProps = {
    nSocio: number,
    marca: string,
    modelo: string,
    cilindrada: number,
    matricula?: string,
    ano?: number,
    avatar?: string,
    categoria?: string
}


export const nextNumberSocio = async () => {
  const reservado = await getReservasArr();
  
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

export const createSocio = async ({ nomeCompleto, role, sexo, email, password, telemovel, tipoSangue, rua, nPorta, codigoPostal, freguesia, concelho, distrito, dataNascimento, responsavel, avatar, kitSocio, kitDate, grupoWhatsApp, grupoWhatsAppDate, status, numeroSocio }:CreateSocioProps) => {
  const reservado = await getReservasArr();
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
            role: role || Role.PARTNER,
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

export const createReserva = async ({nSocio, descricao, note}: ReservaProps) => {
  const reserva = await getReservaByNum(nSocio);
  if(reserva){
    return { error: "Número de sócio já tem uma reserva" };
  }
  try {
    const result = await prisma.reserva.create({
      data: {
        nSocio: nSocio,
        descricao: descricao || DescriptionReserva.CUSTOM,
        note: note || null
      },
    });
    return result;
  } catch (error) {
    console.error("Error creating reserva:", error);
    return { error: "Erro interno do servidor" };
  }
};

export const getSocios = async () => {
    const result = await prisma.socio.findMany();
    return result;
};

export const getReservasArr = async () => {
    const result = await prisma.reserva.findMany();
    const arr = result.map(r => r.nSocio);
    return arr;
};

export const getReservas = async () => {
  const result = await prisma.reserva.findMany();
  return result;
};

export const getReservaByNum = async (nSocio: number) => {
    const result = await prisma.reserva.findFirst({
        where: { nSocio: nSocio }
    }); 
    return result;
};

export const deleteSocio = async (nSocio: number, descricao: DescriptionReserva) => {
    const motos = await getMotoByNumb(nSocio);
    if(motos && motos.length > 0) {
        for(const moto of motos) {
            const linkedSocios = await prisma.mota.findUnique({
                where: { id: moto.id },
                include: { socios: true }
            });
            if(linkedSocios && linkedSocios.socios.length <= 1) {
                await deleteMotoID(moto.id);
            }
        }
    }
  try {
        await prisma.socio.delete({
            where: { nSocio: Number(nSocio) }
        });
        const reserve = await createReserva({
            nSocio: Number(nSocio), 
            descricao: descricao as DescriptionReserva || DescriptionReserva.OLD_PARTNER
        });

        if (reserve && 'error' in reserve) {
            console.error("Error creating reserva after deleting socio:", reserve.error);
            return { error: "Erro ao criar reserva após deletar sócio" };
        }
        return { message: `Sócio com o número ${nSocio} foi deletado com sucesso.` };
    } catch (error) {
        console.error("Error deleting socio:", error);
        return { error: "Erro interno do servidor" };
    }
};

export const deleteReservaByNum = async (nSocio: number) => {
    try {
        await prisma.reserva.delete({
            where: { nSocio: Number(nSocio) }
        });
        return { message: `Reserva com o número ${nSocio} foi deletada com sucesso.` };
    } catch (error) {
        console.error("Error deleting reserva:", error);
        return { error: "Erro interno do servidor" };
    }
};

export const createMoto = async ({nSocio, marca, modelo, cilindrada, matricula, ano, avatar, categoria}: CreateMotoProps) => {
    try {
        const data: any = {
            marca,
            modelo,
            cilindrada: cilindrada, 
            socios: {
              connect: { nSocio: nSocio }
            },
            matricula,
            ano,
            avatar,
            categoria
        };

        if (matricula) data.matricula = matricula;
        if (ano) data.ano = ano;
        if (avatar) data.avatar = avatar;
        if (categoria) data.categoria = categoria;

        const result = await prisma.mota.create({
          data,
        });
        return result;
    } catch (error) {
        console.error("Erro ao criar mota:", error);
        return { error: "Erro ao criar mota" };
    }
};

export const getMotos = async () => {
    const result = await prisma.mota.findMany();
    return result;
};

export const getMotoByNumb = async (nSocio: number) => {
    const socio = await prisma.socio.findUnique({
        where: { nSocio: nSocio },
        include: { motas: true }
    });
    return socio?.motas || null;
}

export const getMotoID = async (id: number) => {
    const moto = await prisma.mota.findUnique({
        where: { id: id }
    });
    return moto || null;
}

export const deleteMotoID = async (id: number) => {
    try {
        await prisma.mota.delete({
            where: { id: Number(id) }
        });
        return { message: `Mota com o id ${id} foi deletada com sucesso.` };
    } catch (error) {
        console.error("Error deleting mota:", error);
        return { error: "Erro interno do servidor" };
    }
};

export const getSocioByMoto = async (id: string) => {
    const socio = await prisma.mota.findUnique({
        where: { id: Number(id) },
        include: { socios: true }
    });
    return socio?.socios || null;
};

