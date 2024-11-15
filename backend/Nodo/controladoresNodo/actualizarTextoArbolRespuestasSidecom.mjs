import { arbolRespuestas } from "../arbolCliente/respuestasSidecom.mjs";
export function actualizarTextoArbolRespuestas(CONTACTOACTUALGLOBAL) {
  arbolRespuestas.respuesta = 
`¡Hola _*${CONTACTOACTUALGLOBAL}*_! 
Soy la asistente virtual de Nuevanet, Para agilizar tuconsulta:

*_por favor elige una opción ingresando el número correspondiente:_*
1️⃣ SOY CLIENTE
2️⃣ QUIERO SER CLIENTE`
}