import express from "express"
import {
  getContactos,
  guardarContacto,
  borrarContacto,
  editarContacto,
} from "../../controllers/contacto/contactoController.mjs"
const router = express.Router();
router.use(express.json());

router.get("/getContactos", getContactos);
router.post("/guardarContacto", guardarContacto);
router.post("/borrarContacto", borrarContacto);
router.post("/editarContacto", editarContacto);
export default router
