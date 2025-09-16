import { Router } from "express";
import * as mainController from '../controllers/main';

export const mainRoutes = Router();

mainRoutes.get("/ping", (req, res) => {
  res.json({pong: true});
});

mainRoutes.post("/socio", mainController.createNewSocioOff);

