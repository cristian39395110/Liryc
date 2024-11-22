import { arbolRespuestas } from "../arbolCliente/respuestasLiryc.mjs";
export function actualizarTextoArbolRespuestas(CONTACTOACTUALGLOBAL) {
  arbolRespuestas.respuesta = 
  `🌞 *Buenos días*,${CONTACTOACTUALGLOBAL}, gracias por comunicarse con *LLliryc SRL*. 

Para continuar, necesitamos verificar sus datos. Por favor, ingrese su número de:

🆔 *DNI del titular*  
   o  
📄 *CUIT asociado a la cuenta*.

_🔒 Su información será tratada con confidencialidad._
`;

}

