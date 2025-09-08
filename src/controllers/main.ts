import { RequestHandler } from "express-serve-static-core";

export const getAllPosts:RequestHandler = async (req, res) => {
    console.log("Sou getAllPosts");
    res.json({
        res: "getAllPosts"
    });
};

export const getPost: RequestHandler = async (req, res) => {
    console.log("Sou getPost");
    res.json({
      res: "getPost",
    });
};

export const getRelatedPosts: RequestHandler = async (req, res) => {
    console.log("Sou getRelatedPosts");
    res.json({
      res: "getRelatedPosts",
    });
};
