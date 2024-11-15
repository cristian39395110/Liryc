import express from "express";
import {
  difundirTest,
  deleteDifusion,
  editarDifusion,
  insertDifusion,
  getDifusion,
  getNotificaciones,
  guardarConfiguracionNotify,
  eliminarNotify,
} from "../../controllers/notificacion/notificacionController.mjs";
const router = express.Router();
// Importación de 'body-parser' para procesar datos del cuerpo de las solicitudes.
// import bodyParser from "body-parser";
router.use(express.json({ limit: "50mb" })); // Configuración de límite de tamaño para el cuerpo de la solicitud.
router.use(express.urlencoded({ limit: "50mb", extended: true }));

router.post("/difundirTest", difundirTest);
router.post("/deleteDifusion", deleteDifusion);
router.post("/editarDifusion", editarDifusion);
router.post("/insertDifusion", insertDifusion);
router.get("/getDifusion", getDifusion);
router.get("/getNotificaciones", getNotificaciones);
router.post("/guardarConfiguracionNotify", guardarConfiguracionNotify);
router.post("/eliminarNotify", eliminarNotify);

export default router;
