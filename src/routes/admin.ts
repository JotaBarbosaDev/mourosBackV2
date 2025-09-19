import { Router } from "express";
import * as adminController from '../controllers/admin';


export const adminRoutes = Router();

adminRoutes.post('/socio', adminController.createNewSocio);
adminRoutes.get("/socios", adminController.getAllSocios);
adminRoutes.get("/socio/:nSocio", adminController.getSocioByNum);
adminRoutes.get("/socio/mota/:id", adminController.getSocioByMotoId);
//adminRoutes.put("/socio/:nSocio/:idMoto", adminController.addPartnerToMoto);
adminRoutes.delete("/socio/:nSocio", adminController.deleteSocioByNumber);
adminRoutes.post("/moto", adminController.createNewMoto);
adminRoutes.get("/moto/:id", adminController.getMotoById);
adminRoutes.get("/motas", adminController.getAllMotos);
adminRoutes.delete("/moto/:id", adminController.deleteMotoById);
adminRoutes.get("/mota/:nSocio", adminController.getMotoByNum);
adminRoutes.post("/reserva",  adminController.createNewReserva);
adminRoutes.get("/reservas", adminController.getAllReservas);
adminRoutes.get("/reserva/:nSocio", adminController.getReservaByNumber);
adminRoutes.get("/reservasArr", adminController.getAllReservasArray);
adminRoutes.delete("/reserva/:nSocio", adminController.deleteReservaByNumber);
