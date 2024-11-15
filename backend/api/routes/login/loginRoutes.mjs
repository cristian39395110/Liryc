import express from 'express'
import {login, cerrarSesion} from "../../controllers/login/loginController.mjs"
const router = express.Router();
router.use(express.json());
//CRUD STOCK

router.post('/', login);
router.post('/cerrarSesion', cerrarSesion);

export default router