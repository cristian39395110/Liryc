import insertDataMensaje from "../../controladores/insertDataMensaje.mjs";
import { guardarContacto } from "../../controladores/guardarContacto.mjs";
import { manejarError } from "./manejarError.mjs";
import con from "../../database/conexion.mjs";
import { buscarNodoActual } from "./buscarNodoActual.mjs";
import { actualizarTextoArbolRespuestas } from "./actualizarTextoArbolRespuestaLiryc.mjs";
import { recorrerArbol } from "./recorrerArbolLiryc.mjs";
import { respuestaNoEncontrada } from "../arbolCliente/respuestaNoEncontradaLiryc.mjs";
import { arbolRespuestas } from "../arbolCliente/respuestasLiryc.mjs";
import { promisify } from 'util';

let RANGOMENSAJE = "medusa";
// Usa un Set para el cacheo
const contactoCache = new Map(); // Utiliza un Map para almacenar la información del contacto
export async function gestionMensajes(mensaje, texto, telefon, client) {
 
  let rangoCLienteActivo = "";
  const telefono = telefon.trim(); // Evitar espacios accidentales.
  const msj = texto.toLowerCase().trim();
  
  try {
     // Verifica y cachea el contacto si no está en el Map.
     let contact = contactoCache.get(telefono);
     if (!contact) {
       const [fetchedContact, profilePicUrl] = await Promise.all([
         mensaje.getContact(),
         client.getProfilePicUrl(telefono)
       ]);
 
       contact = {
         pushname: fetchedContact.pushname,
         profilePicUrl: profilePicUrl
       };
 
       
 
       await guardarContacto(contact.pushname, telefono, profilePicUrl, client);
       contactoCache.set(telefono, contact);
     } 
   
    // Consulta de base de datos optimizada para evitar bloqueos.
    const query = promisify(con.query).bind(con);
    const result = await query("SELECT telefono, rango FROM clientesactivo WHERE telefono = ?", [telefono]);

    if (result.length > 0) {
      // Cliente activo, actualiza fecha de mensaje.
      rangoCLienteActivo = result[0].rango;
      // const fecha = Date.now();

      // await query("UPDATE clientesactivo SET fechaMensaje=? WHERE telefono=?", [fecha, telefono]);
      
      const ultimoId = await query("SELECT MAX(idMensaje) as ultimoId FROM mensajes");
      const ultimoIdActivo = ultimoId[0].ultimoId;

      await insertDataMensaje(mensaje, 1, RANGOMENSAJE, '', rangoCLienteActivo, true, ultimoIdActivo);

    } else {
      // Cliente no activo: lógica de chatbot y creación de contacto.
      await gestionarChatBot(telefono, msj, contact, mensaje);
      
      const ultimoId = await query("SELECT MAX(idMensaje) as ultimoId FROM mensajes");
      const ultimoIdMensaje = ultimoId[0].ultimoId;

      await insertDataMensaje(mensaje, 1, RANGOMENSAJE, 'usuario', rangoCLienteActivo, false, ultimoIdMensaje);
    }

  } catch (error) {
    manejarError(error);
  }
}

// Función separada para manejar la lógica del chatbot.
async function gestionarChatBot(telefono, msj, contact, mensaje) {
  const menuActual =  await buscarNodoActual(telefono);

  if (msj === "hola") {
    actualizarTextoArbolRespuestas(contact.pushname);
    return recorrerArbol(telefono, arbolRespuestas, "hola", "", "raiz", "hola", "", "", contact, '');
  }

  if (menuActual !== null) {
    const resp = await recorrerArbol(
      telefono, arbolRespuestas, msj, menuActual.datos, menuActual.menu, 
      menuActual.numero, menuActual.opcion, menuActual.instancia, contact, 
      menuActual.menuFinal, menuActual.otros, mensaje
    );
  if(resp){
    if (resp.notificaOperador !== true) {
      mensaje.body = resp ? resp.menu : msj;
    } else if (menuActual.menu === "Consulta tecnica" || menuActual.menu === "Inconvenientes con el servicio" ) {
      mensaje.body = 
      `SOLICITANDO ASISTENCIA:
      ${
      menuActual.opcion === '' ? 
      (`*CONSULTA: 
      ${menuActual.menuFinal}`)
      :
      (`
      *Opción: 
      - ${menuActual.menuFinal}

      *Consulta: 
      - ${msj}
      `)
      }`;
    } else if(resp.datos === 'DNI NO ENCONTRADO') {
      mensaje.body = `DNI NO ENCONTRADO: el usuario intento ingresar el DNI: *${msj}*, pero no se encuentra en la base de datos de ISP Cube`;
    }
    
    else if (resp.menu === 'ServicioDeriva') {
      mensaje.body = `SOLICITANDO ASISTENCIA:
      ${
        menuActual.opcion === "" 
          ? `*CONSULTA: Consultas Tecnicas`
          : `*Opción:\n- Problemas con el internet\n\n*Consulta:\n- ${msj}`
      }`;
    }
    else if (resp.menu === 'DerivaInconvenientesConElServicio') {
      mensaje.body = `SOLICITANDO ASISTENCIA:
      ${
        menuActual.opcion === "" 
          ? `*CONSULTA: Inconveniente con el servicio`
          : `*Opción:\n- Inconveniente con el servicio de internet\n\n*Consulta:\n- ${msj}`
      }`;
    }
    else if (resp.menu === "DerivaArraydeServicio") {
      mensaje.body = `SU RECLAMO ES:
      ${
          menuActual.opcion === "" 
          ? ""
          : `*Reclamo:\n- ${msj}`
      }`; 
  }
  
    else if (resp.menu === 'usuario fibra o antena') {
      mensaje.body = `SOLICITANDO ASISTENCIA:
      ${
        menuActual.opcion === "" 
          ? `*CONSULTA: No tiene internet-`
          : `*Opción:\n- Cliente no tiene internet-\n${resp.datos.tipodeinternet}
         `
      }`; 
    }
    
    else {
    msj !== '0' ? respuestaNoEncontrada(telefono, contact) : false
    }
  }
  }else{
    respuestaNoEncontrada(telefono, contact);
  }
}