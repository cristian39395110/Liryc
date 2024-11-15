import { arbolRespuestas } from "../arbolCliente/respuestasSidecom.mjs";
export function actualizarTextoArbolRespuestas(CONTACTOACTUALGLOBAL) {
  arbolRespuestas.respuesta = 
`¡Hola _*${CONTACTOACTUALGLOBAL}*_! 
Soy SIDE 👩‍🦰 la asistente virtual de Sidecom, Para agilizar tu consulta:

*_por favor elige una opción ingresando el número correspondiente:_*
1️⃣ SOY CLIENTE
2️⃣ QUIERO SER CLIENTE`
}