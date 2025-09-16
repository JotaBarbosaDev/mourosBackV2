import { RequestHandler } from "express-serve-static-core";
import z from 'Zod';
import { createToken } from "../services/auth";
import { createSocioOff } from "../services/main";

export const createNewSocioOff: RequestHandler = async (req, res) => {
    const schema = z.object({
      nomeCompleto: z.string(),
      sexo: z.enum(["MASCULINO", "FEMININO", "OUTRO"]),
      email: z.string(),
      password: z.string().min(6),
      telemovel: z.string().min(9),
      tipoSangue: z
        .enum([
          "ND",
          "A_POSITIVO",
          "A_NEGATIVO",
          "B_POSITIVO",
          "B_NEGATIVO",
          "AB_POSITIVO",
          "AB_NEGATIVO",
          "O_POSITIVO",
          "O_NEGATIVO",
        ])
        .optional(),
      rua: z.string(),
      nPorta: z.string(),
      codigoPostal: z.string(),
      freguesia: z.string(),
      concelho: z.string(),
      distrito: z.string(),
      dataNascimento: z.string().transform((str) => new Date(str)),
      responsavel: z.string().default("ND"),
      avatar: z.string().optional(),
      numeroSocio: z.number().optional(),
    });

    const data = schema.safeParse(req.body);
    
    if (!data.success) {
        return res.status(400).json({ error: data.error });
    }

    try {
        const result = await createSocioOff(data.data);
        
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
