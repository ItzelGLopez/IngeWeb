import { Router } from "express";
import cookieParser from 'cookie-parser';
import { getAllUsers , modificac,contra, login,index,admin,Operativo,registra,registrarUsuario,borrauser,Tokenauth,Tokenautho,cargar,carrito,info,correos,Tokenauthc,cambia } from "../controllers/users.controllers.js"
const router = Router();


router.post("/registrar",registrarUsuario);
router.post("/login", login);
router.get('/eliminar', Tokenauth,borrauser);
router.get("/cargar",Tokenautho,cargar);
router.get("/carrito",Tokenautho,carrito);
router.get("/editar/")
router.post("/infoc",Tokenautho,info);
router.post("/correos",correos);
router.post("/cambia",Tokenauthc,cambia);
router.get('/restablecer-contrasena/:token',contra);
router.post("/modifica",modificac);
//VISTAS
router.get("/index",index);
router.get("/admin",Tokenauth,admin);
router.get("/Operativo",Tokenauth,Operativo);
router.get("/registra",registra);


export default router;

