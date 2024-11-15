import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
const client = obtenerClienteDeWhatsapp(colors, false)
import { subirImagen } from "../../controladores/subirImagen.mjs"
import { comprobarTelefono } from "../../controladores/comprobarTelefono.mjs"
import {confirmarDatos} from "./confirmarDatos.mjs"
import {enviarRespuesta} from "./enviarRespuesta.mjs"
import {guardarNodoActual} from "./guardarNodoActual.mjs"
import {limpiarTelefonoMenuCliente} from "./limpiarTelefonoMenuCliente.mjs"
import {respuestaNoEncontrada} from "../arbolCliente/respuestaNoEncontrada.mjs"
import { devolverOpcionSeleccionada } from './devolverOpcionSeleccionada.mjs'
import { arbolRespuestas } from '../arbolCliente/respuestas.mjs'
import { buscarNodoActual } from './buscarNodoActual.mjs'
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
export const recorrerArbol = async (telefono, nodoActual, mensaje, datos, menuActual, numeroActual, opcion, instancia, contact, menuFinal) => {

  if (instancia === 'confirmar') {
      confirmarDatos(telefono, mensaje, opcion, menuFinal);
  } else {
      if (menuActual === 'clienteConfirma' && mensaje === '1') {
        buscarNodoActual(telefono, function(nodo){
                // console.log(nodo)
        })
          comprobarTelefono(telefono, menuFinal);
          enviarRespuesta(telefono, `Derivé tu consulta al departamento correspondiente. Nos comunicaremos contigo a la brevedad. ¡Saludos!`);
          // limpiarTelefonoMenuCliente(telefono);
      } else if (menuActual === 'clienteConfirma' && mensaje === '2') {
        //   console.log("entra a la opcion 2 NO CONFIRMA")
          nodoActual = arbolRespuestas;
          menuActual = 'raiz';
          numeroActual = 'hola';
          mensaje = 'hola';
      }

      //BUSCA EN EL ARBOL DESDE LA RAIZ
      let siguienteNodo = await nodoActual.buscarOpcion(menuActual, numeroActual, mensaje);

      if (siguienteNodo !== null && siguienteNodo !== undefined) {

          if (siguienteNodo.pideOpcion) { //CAPTURA LAS OPCIONES
              guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), '', '', '');
              enviarRespuesta(telefono, siguienteNodo.getRespuesta());
          } else if (siguienteNodo.pideDatos) { // CAPTURA LOS DATOS DEL CLIENTE
              guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, devolverOpcionSeleccionada(mensaje, siguienteNodo.getMenu()), 'confirmar', siguienteNodo.getDerivaNombreArea());
              enviarRespuesta(telefono, siguienteNodo.getRespuesta());
          } else if (!siguienteNodo.pideDatos && !siguienteNodo.pideOpcion) { // FLUJO NORMAL
              guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), '', '', '');
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

          if (siguienteNodo.getDerivaConsulta()) { //DERIVA LA CONSULTA A UN OPERADOR
              comprobarTelefono(telefono, siguienteNodo.getDerivaNombreArea(), mensaje);
              if (siguienteNodo.getMenu() === 'derivadoTecnico') {
                  client.sendMessage('5492664840533@c.us', `El cliente quiere algo https://wa.me/${telefono}`)
              } else if (siguienteNodo.getMenu() === 'derivadoServicio') {
                  client.sendMessage('5493412298043@c.us', `El cliente quiere algo https://wa.me/${telefono}`)
              }
              // enviarRespuesta(telefono, respuesta.getRespuesta());
              limpiarTelefonoMenuCliente(telefono);
          }
          return siguienteNodo;
      } else {
          // console.log("Opción no encontrada");
          // enviarRespuesta(telefono, "Opción no encontrada");
          // return false;
          if(menuActual !== 'clienteConfirma'){
            // respuestaNoEncontrada(telefono, contact)
          }else if(menuActual === 'clienteConfirma'){
            return false;
          }
         
      }
  }

};