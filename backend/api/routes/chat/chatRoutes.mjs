import express from 'express'
import {mensajeMedusa, cerrarChat, contactoActivo, cambiarRangoCliente, empleados, filtroRangoDios, guardar, offNuevoMensaje, chatMensajes, getCliente, verConexion, getFactura6, refrecarContactos, verTicket, getCategoriaTickets, estadoTickets, areasTickets} from  "../../controllers/chat/chatController.mjs"
const router = express.Router();
// Importación de 'body-parser' para procesar datos del cuerpo de las solicitudes.
// import bodyParser from "body-parser";
router.use(express.json({ limit: "25mb" })); // Configuración de límite de tamaño para el cuerpo de la solicitud.
router.use(express.urlencoded({ limit: "25mb", extended: true }));

router.post('/mensajeMedusa', mensajeMedusa)
router.post('/cerrarChat', cerrarChat)
router.post('/contactoActivo', contactoActivo)
router.post('/cambiarRangoCliente', cambiarRangoCliente)
router.get('/empleados', empleados);
router.get('/filtroRangoDios', filtroRangoDios);
router.post('/guardar', guardar)
router.post('/offNuevoMensaje', offNuevoMensaje)
router.get('/chatMensajes', chatMensajes);

router.post('/getCliente', getCliente);
router.post('/verConexion', verConexion);
router.post('/getFactura6', getFactura6);
router.get('/refrecarContactos', refrecarContactos);
router.post('/verTicket', verTicket);
router.get('/getCategoriaTickets', getCategoriaTickets);
router.get('/estadoTickets', estadoTickets);
router.get('/areasTickets', areasTickets);
// router.post('/verTicket', getFactura6);
// router.post('/verTicket', getFactura6);

export default router;