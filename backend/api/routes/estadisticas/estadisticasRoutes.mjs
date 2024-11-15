import express from 'express';
import {consultas, mensaje, clienteAtendido, clienteNoAtendido, buscarPorFechaDesde,  buscarPorRangoDeFechas} from  "../../controllers/estadisticas/estadisticasController.mjs"
const router = express.Router();
router.use(express.json());

router.get('/consultas', consultas);
router.get('/mensaje', mensaje);
router.get('/clienteAtendido', clienteAtendido)
router.get('/clienteNoAtendido', clienteNoAtendido)
router.post('/buscarPorFechaDesde', buscarPorFechaDesde)
router.post('/buscarPorRangoDeFechas', buscarPorRangoDeFechas)

export default router;