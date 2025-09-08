import { RequestHandler } from "express";
import z from "zod";
import { createUser } from "../services/socio";
import { createToken } from "../services/auth";

export const signup:RequestHandler = async (req, res) => {
    const schema = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string(),
    });

    const data = schema.safeParse(req.body);

    if(!data.success){
        res.json({
            error: data.error
        });
        return;
    }

    const newUser = await createUser(data.data);
    if(!newUser){
        res.json( {error: "Erro ao criar utilizador"} );
        return;
    }
    
    const token = createToken(newUser);

    res.status(201).json({
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        },
        token
    })
};

export const signin: RequestHandler = async (req, res) => {};

export const validate: RequestHandler = async (req, res) => {};

