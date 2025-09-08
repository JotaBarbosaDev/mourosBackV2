import { RequestHandler } from "express";
import { createSocio } from "../services/socio";
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
        status: z.enum(["ATIVO", "INATIVO", "SUSPENSO", "HONORARIO"]).optional()
    });

    const data = schema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ error: data.error });
    }

    try {
        const result = await createSocio(data.data);
        if (result) {
            // Remover dados sensíveis antes de enviar para o frontend
            const { password, ...safeResult } = result;
            return res.status(201).json({
                message: "Sócio criado com sucesso",
                socio: safeResult
            });
        }
        return res.status(400).json({ message: "Número de sócio já existe" });
    } catch (error) {
        console.error("Error creating socio:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
};

export const getPosts: RequestHandler = async (req, res) => {};

export const getPost: RequestHandler = async (req, res) => {};

export const editPost: RequestHandler = async (req, res) => {};

export const removePosts: RequestHandler = async (req, res) => {};
