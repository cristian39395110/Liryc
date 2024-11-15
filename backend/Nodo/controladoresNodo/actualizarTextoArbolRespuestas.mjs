import { arbolRespuestas } from "../arbolCliente/respuestas.mjs";
export function actualizarTextoArbolRespuestas(CONTACTOACTUALGLOBAL) {
  arbolRespuestas.respuesta = 
  `¡Hola _*${CONTACTOACTUALGLOBAL}*_! ¿En qué puedo ayudarte hoy?
  Por favor, elige una opción ingresando el número correspondiente:
  1- Quiero saber más acerca de Ruvik y Medusa
  2- Quiero que un representante se contacte conmigo`
}
