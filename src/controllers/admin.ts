import { RequestHandler } from "express";
import { createSocio, getSocios } from "../services/admin";
import { z } from "zod";

export const addPost:RequestHandler = async (req, res) => {
    
};

export const createNewSocio: RequestHandler = async (req, res) => {
    const schema = z.object({
        nomeCompleto: z.string(),
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
        status: z.enum(["ATIVO", "INATIVO", "SUSPENSO", "HONORARIO"]).optional(),
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
            return res.status(201).json({
                message: "Sócio criado com sucesso",
                socio: result
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
