import { RequestHandler } from "express";
import {
  createSocio,
  getSocioByNumero,
  getSocios,
  createReserva,
  getReservaByNum,
  getReservas,
  getReservasArr,
  deleteSocio,
  deleteReservaByNum
} from "../services/admin";
import { z } from "Zod";
import { DescriptionReserva } from "@prisma/client";
import { createToken } from "../services/auth";

export const createNewSocio: RequestHandler = async (req, res) => {
    const schema = z.object({
        nomeCompleto: z.string(),
        role: z.enum(["ADMIN", "PRESIDENT", "TREASURER", "SECRETARY", "BOARD_MEMBER", "PARTNER", "VISITOR"]),
        sexo: z.enum(["MASCULINO", "FEMININO", "OUTRO"]),
        email: z.string().email(),
        password: z.string().min(6),
        telemovel: z.string().min(9),
        tipoSangue: z.enum([
            "ND", "A_POSITIVO", "A_NEGATIVO", 
            "B_POSITIVO", "B_NEGATIVO", 
            "AB_POSITIVO", "AB_NEGATIVO", 
            "O_POSITIVO", "O_NEGATIVO"
        ]).optional(),
        rua: z.string(),
        nPorta: z.string(),
        codigoPostal: z.string(),
        freguesia: z.string(),
        concelho: z.string(),
        distrito: z.string(),
        dataNascimento: z.string().transform(str => new Date(str)),
        responsavel: z.string(),
        avatar: z.string().optional(),
        kitSocio: z.boolean().optional(),
        kitDate: z.string().transform(str => new Date(str)).optional(),
        grupoWhatsApp: z.boolean().optional(),
        grupoWhatsAppDate: z.string().transform(str => new Date(str)).optional(),
        status: z.enum(["ATIVO", "INATIVO", "SUSPENSO", "HONORARIO"]),
        numeroSocio: z.number().optional()
    });

    const data = schema.safeParse(req.body);
    
    if (!data.success) {
        return res.status(400).json({ error: data.error });
    }

    try {
        const result = await createSocio(data.data);
        
        if (result && 'error' in result) {
            return res.status(400).json(result);
        }
        
        if (result) {
            const token = createToken(result);
            return res.status(201).json({
                message: "Sócio criado com sucesso",
                socio: result,
                token
            });
        }
        
        return res.status(400).json({ error: "Erro ao criar sócio" });
    } catch (error) {
        console.error("Error creating socio:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const getAllSocios: RequestHandler = async (req, res) => {
    const socios = await getSocios();
    if(socios) {
        return res.status(200).json(socios);
    }
    return res.status(404).json({ message: "Nenhum sócio encontrado" });
};

export const getSocioByNum: RequestHandler = async (req, res) => {
    const { nSocio } = req.params;
    const socio = await getSocioByNumero(Number(nSocio));
    if (socio) {
        return res.status(200).json(socio);
    }
    return res.status(404).json({ message: `Nenhum sócio encontrado com o numero ${nSocio}.` });
};

export const createNewReserva: RequestHandler = async (req, res) => {
    const schema = z.object({
        nSocio: z.number(),
        descricao: z.enum([DescriptionReserva.OLD_PARTNER, DescriptionReserva.NO_PAY, DescriptionReserva.EXPELLED, DescriptionReserva.EVENT, DescriptionReserva.HONOR, DescriptionReserva.CUSTOM]),
        note: z.string().optional()
    });

    const data = schema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ error: data.error});
    }

    const socio = await getSocioByNumero(data.data.nSocio);
    if (socio) {
        return res.status(400).json({ 
            error: "O número já está ocupado por um sócio existente" 
        });
    }

    try {
        const result = await createReserva(data.data.nSocio, data.data.descricao || DescriptionReserva.CUSTOM, data.data.note);
        
        if (result && 'error' in result) {
            return res.status(500).json(result);
        }
        
        return res.status(201).json({ 
            message: "Reserva criada com sucesso",
            reserva: { nSocio: data.data.nSocio, descricao: data.data.descricao }
        });
    } catch (error) {
        console.error("Error creating reserva:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const getAllReservas: RequestHandler = async (req, res) => {
    const reservas = await getReservas();
    if(reservas) {
        return res.status(200).json(reservas);
    }
    return res.status(404).json({ message: "Nenhuma reserva encontrada" });
};

export const getAllReservasArray: RequestHandler = async (req, res) => {
  const reservas = await getReservasArr();
  if (reservas) {
    return res.status(200).json(reservas);
  }
  return res.status(404).json({message: "Nenhuma reserva encontrada"});
};

export const getReservaByNumber: RequestHandler = async (req, res) => {
    const { nSocio } = req.params;
    const reserva = await getReservaByNum(Number(nSocio));
    if (reserva) {
        return res.status(200).json(reserva);
    }
    return res.status(404).json({ message: `Nenhuma reserva encontrada com o numero ${nSocio}.` });
}

export const deleteSocioByNumber: RequestHandler = async (req, res) => {

    const schema = z.object({
        nSocio: z.number().max(9999),
        descricao: z.enum([DescriptionReserva.OLD_PARTNER, DescriptionReserva.NO_PAY, DescriptionReserva.EXPELLED, DescriptionReserva.EVENT, DescriptionReserva.HONOR, DescriptionReserva.CUSTOM])
    });

    const data = schema.parse(req.body);

    if(!data) {
        console.log("Invalid data:", data);
        return res.status(400).json({ error: "Dados inválidos"});
    }

    const { nSocio, descricao } = data;
    const socio = await getSocioByNumero(data.nSocio);
    if (!socio) {
        return res.status(404).json({ message: `Nenhum sócio encontrado com o numero ${data.nSocio}.` });
    }
    await deleteSocio(Number(data.nSocio), data.descricao);
    return res.status(200).json({ message: `Sócio com o número ${data.nSocio} foi deletado com sucesso.` });
};

export const deleteReservaByNumber: RequestHandler = async (req, res) => {
    const { nSocio } = req.params;
    const reserva = await getReservaByNum(Number(nSocio));
    if (!reserva) {
        return res.status(404).json({ message: `Nenhuma reserva encontrada com o numero ${nSocio}.` });
    }
    await deleteReservaByNum(Number(nSocio));
    return res.status(200).json({ message: `Reserva com o número ${nSocio} foi deletada com sucesso.` });
};
