import express from "express";
import {
  ticket,
  deleteTickets,
  ticketsOperador,
  ticketAsignadosPorOperador,
  ticketAsignadosPorOperadorProceso,
  ticketAsignadosPorOperadorAbiertos,
  ticketAsignadosPorOperadorCerrados,
  insertTicket,
  updateTicket,
  areas
} from "../../controllers/tickets/ticketsController.mjs";
const router = express.Router();
router.use(express.json());
router.get("/ticket", ticket);
router.post("/deleteTickets", deleteTickets);
router.post("/ticketsOperador", ticketsOperador);
router.post("/ticketAsignadosPorOperador", ticketAsignadosPorOperador);
router.post(
  "/ticketAsignadosPorOperadorProceso",
  ticketAsignadosPorOperadorProceso
);
router.post("/ticketAsignadosPorOperadorAbiertos", ticketAsignadosPorOperadorAbiertos)
router.post("/ticketAsignadosPorOperadorCerrados", ticketAsignadosPorOperadorCerrados)
router.post("/insertTicket", insertTicket)
router.post("/updateTicket", updateTicket)
router.get("/areas", areas)
export default router;
