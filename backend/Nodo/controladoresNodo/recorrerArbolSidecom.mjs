import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
const client = obtenerClienteDeWhatsapp(colors, false)
import { subirImagen } from "../../controladores/subirImagen.mjs"
import { comprobarTelefono } from "../../controladores/comprobarTelefono.mjs"
import {confirmarDatos} from "./confirmarDatos.mjs"
import {enviarRespuesta} from "./enviarRespuesta.mjs"
import {guardarNodoActual} from "./guardarNodoActual.mjs"
import {limpiarTelefonoMenuCliente} from "./limpiarTelefonoMenuCliente.mjs"
import {respuestaNoEncontrada} from "../arbolCliente/respuestaNoEncontradaSidecom.mjs"
import { devolverOpcionSeleccionada } from './devolverOpcionSeleccionadaSidecom.mjs'
import { arbolRespuestas, noEncuentraDNI,encuentraDNIMensaje } from '../arbolCliente/respuestasSidecom.mjs'
import {opcionEsClienteLogeado} from '../arbolCliente/respuestasSidecom.mjs'
import { buscarNodoActual } from './buscarNodoActual.mjs'
import { logearClienteIspCube } from './logearClienteIspCube.mjs'
import {buscarUltimaFacturaIspCube} from './buscarUltimaFacturaIspCube.mjs'
import { mediosDePagoIspCube } from './mediosDePagoIspCube.mjs'
import { opcionComprobanteDePago } from './opcionComprobanteDePago.mjs'

/**
 * Función para recorrer el árbol de respuestas y gestionar las interacciones con el cliente de WhatsApp.
 * @param {string} telefono - El número de teléfono del cliente.
 * @param {Nodo} nodoActual - El nodo actual en el árbol de respuestas.
 * @param {string} mensaje - El mensaje recibido del cliente de WhatsApp.
 * @param {object} datos - Datos adicionales (si es necesario) para el proceso.
 * @param {string} menuActual - El nombre del menú actual.
 * @param {number} numeroActual - El número identificador actual.
 * @param {string} opcion - La opción seleccionada (si aplica).
 * @param {string} instancia - Indica la instancia de la función (por ejemplo, 'confirmar' para confirmación de datos).
 */
export const recorrerArbol = async (telefono, nodoActual, mensaje, datos, menuActual, numeroActual, opcion, instancia, contact, menuFinal, otros, mensajeCompleto) => {
  // console.log(mensajeCompleto, " mensaje en recorrer arbol")
  if (instancia === 'confirmar') {
    if(menuActual === 'opcionComprobante'){
      opcionComprobanteDePago(telefono, mensaje, opcion, menuFinal, otros, datos, mensajeCompleto.type)
    }else{
      confirmarDatos(telefono, mensaje, opcion, menuFinal, otros, datos);
      if(menuFinal === 'Inconvenientes con el servicio' || menuFinal === 'Consulta tecnica'){
        comprobarTelefono(telefono, 'tecnico');
    }
      enviarRespuesta(telefono,
`*Perfecto! Derivé tu consulta a uno de nuestros representantes*
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos *_${contact.pushname}_*! - *Te saluda tu asistente de Sidecom 👩‍🦰*`);
      limpiarTelefonoMenuCliente(telefono);
    return {notificaOperador: true, datos: {}, menu: menuActual}
    }
      
  }else if (instancia === 'confirmarDatosClienteIspCube') {
    const clienteLogeado = await logearClienteIspCube(telefono, mensaje, datos);
    if (clienteLogeado.success) {
      const datos = clienteLogeado.clientData;

      guardarNodoActual(telefono, "clienteConfirmaIspOk",numeroActual, mensaje, datos.status,instancia, 'logeado', datos.id);
      client.sendMessage(telefono,encuentraDNIMensaje(datos));
      setTimeout(() => {client.sendMessage(telefono, opcionEsClienteLogeado);}, 1500);
    } else {
      guardarNodoActual(telefono, "clienteConfirmaIspError",numeroActual, "", opcion,instancia, menuFinal, otros);
      client.sendMessage(telefono, noEncuentraDNI);
      comprobarTelefono(telefono, "ventas");
      limpiarTelefonoMenuCliente(telefono);
      return {notificaOperador: true, menu: menuActual, datos: 'DNI NO ENCONTRADO'};
    }
  }
   else {
      if(mensaje === '0' && datos.length >= 7){
enviarRespuesta(telefono, 
`¿En que puedo ayudarte?
*_Por favor elige una opción ingresando el número correspondiente:_*
1️⃣ ADMINISTRACION/FACTURACION
2️⃣ VENTAS
3️⃣ SOPORTE TECNICO
`)
nodoActual = arbolRespuestas;
menuActual = 'opcionEsClienteLogeado';
numeroActual = 'logeado';
guardarNodoActual(telefono, menuActual, numeroActual, datos, opcion, '', devolverOpcionSeleccionada(mensaje, menuActual), otros);
      }
      if(menuActual === 'clienteConfirmaIspError'){
        // nodoActual = arbolRespuestas;
        // menuActual = 'raiz';
        // numeroActual = 'hola';
        // mensaje = mensaje;
        return {notificaOperador: true, datos: {}, menu: menuActual}
      }
      if(menuActual === 'clienteConfirmaCbuError'){
        nodoActual = arbolRespuestas;
        menuActual = 'administracion';
        numeroActual = '1';
        mensaje = mensaje;
      }
      if(menuActual === 'clienteConfirmaIspOk'){ //logear cliente // vuelve al menu despues de logearse
        nodoActual = arbolRespuestas;
        menuActual = 'opcionEsClienteLogeado';
        numeroActual = 'logeado';
        mensaje = mensaje;
      }
      if(menuActual === 'facturaConfirmaIspOk'){  // vuelve al menu despues mostrar factura
        nodoActual = arbolRespuestas;
        menuActual = 'administracion';
        numeroActual = '1';
        mensaje = mensaje;
      }
      if(menuActual === 'facturaConfirmaIsError'){  // vuelve al menu despues mostrar factura
        nodoActual = arbolRespuestas;
        menuActual = 'administracion';
        numeroActual = '1';
        mensaje = mensaje;
      }


      //BUSCA EN EL ARBOL DESDE LA RAIZ
      let siguienteNodo = await nodoActual.buscarOpcion(menuActual, numeroActual, mensaje);
      // console.log(nodoActual)
    // console.log(siguienteNodo);
      if (siguienteNodo !== null && siguienteNodo !== undefined) {

          if (siguienteNodo.pideOpcion) { //CAPTURA LAS OPCIONES
            //  console.log("menuActual:",menuActual, "siguiente nodo:", siguienteNodo.getMenu());
                guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, devolverOpcionSeleccionada(mensaje, menuActual), '', '', '');
              enviarRespuesta(telefono, siguienteNodo.getRespuesta());
          } else if (siguienteNodo.pideDatos) { // CAPTURA LOS DATOS DEL CLIENTE
                if(siguienteNodo.getMenu() === 'opcionEsCliente'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, 'confirmarDatosClienteIspCube', devolverOpcionSeleccionada(mensaje, menuActual), otros);
                }else{ //flujo normal 
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, 'confirmar', devolverOpcionSeleccionada(mensaje, menuActual), otros);
                }
              enviarRespuesta(telefono, siguienteNodo.getRespuesta());
          } else if (!siguienteNodo.pideDatos && !siguienteNodo.pideOpcion) { // FLUJO NORMAL
            // console.log(menuActual, "menu actual", mensaje, "mensaje")
             if(menuActual === 'administracion' && mensaje === '2'){ //medios de pago
              mediosDePagoIspCube(telefono, mensaje, opcion, menuFinal, otros, datos)
            }else if(menuActual === 'administracion' && mensaje === '1'){ //reenvio factura
              buscarUltimaFacturaIspCube(telefono, mensaje, opcion, menuFinal, otros, datos)
            }else{
              // FLUJO NORMAL
              guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, instancia, menuFinal, otros);
            
              
              if (siguienteNodo.getImagen() !== '') { // SI EL MENSAJE TIENE UNA IMAGEN ENVÍO LA IMAGEN
                  subirImagen(telefono, siguienteNodo.getImagen());
                  enviarRespuesta(telefono, siguienteNodo.getRespuesta());
                  // setTimeout(() => {
                  //   //HAY QUE DARLE TIEMPO PARA QUE EL MENSAJE SE CONTESTE LUEGO DE LA IMAGEN
                  // },1800) 
              } else { // SI NO, SOLO ENVÍO EL MENSAJE
                  enviarRespuesta(telefono, siguienteNodo.getRespuesta());
              }
            }
          }

          if (siguienteNodo.getDerivaConsulta()) { //DERIVA LA CONSULTA A UN OPERADOR
              comprobarTelefono(telefono, siguienteNodo.getDerivaNombreArea(), mensaje);
             
              // enviarRespuesta(telefono, respuesta.getRespuesta());
              limpiarTelefonoMenuCliente(telefono);
          }
          return {notificaOperador: false, datos:{}, menu: siguienteNodo.menu};
      } else {
          // console.log("Opción no encontrada");
          // enviarRespuesta(telefono, "Opción no encontrada");
          // return {notificaOperador: true, datos: {}, menu: ''};
          // console.log(menuActual, "antes de cliente confirma")
          if(menuActual !== 'clienteConfirma'){
            if(datos !== null){
              if(datos.length < 7){
                respuestaNoEncontrada(telefono, contact)
              }else{
                return {notificaOperador: true, datos: {}, menu: menuActual};
              }
            }
           
          }else if(menuActual === 'clienteConfirma'){
            return {notificaOperador: true, datos: {}, menu: menuActual};
          }
         
      }
  }

};
