import { Router } from "express";
import * as adminController from '../controllers/admin';


export const adminRoutes = Router();

adminRoutes.post('/socio', adminController.createNewSocio);
adminRoutes.get("/socios", adminController.getAllSocios);
