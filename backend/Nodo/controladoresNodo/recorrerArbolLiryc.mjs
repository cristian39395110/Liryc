import obtenerClienteDeWhatsapp from '../../conexionWhatsapp/conexionW.js'
import colors from 'colors/safe.js'
const client = obtenerClienteDeWhatsapp(colors, false)
import { subirImagen } from "../../controladores/subirImagen.mjs"
import { comprobarTelefono } from "../../controladores/comprobarTelefono.mjs"
import {confirmarDatos} from "./confirmarDatos.mjs"
import {enviarRespuesta} from "./enviarRespuesta.mjs"
import {guardarNodoActual} from "./guardarNodoActual.mjs"
import {limpiarTelefonoMenuCliente} from "./limpiarTelefonoMenuCliente.mjs"
import {respuestaNoEncontrada} from "../arbolCliente/respuestaNoEncontradaLiryc.mjs"
import { devolverOpcionSeleccionada } from './devolverOpcionSeleccionadaSidecom.mjs'

import { arbolRespuestas,tecnicoLogeado,tecnicoLogeadoOpcion2, noEncuentraDNI,encuentraDNIMensaje,menuVolver,opcionEsClienteLogeado, menuPrincipal } from '../arbolCliente/respuestasLiryc.mjs'
import { buscarNodoActual } from './buscarNodoActual.mjs'
import { logearClienteIspCube } from './logearClienteIspCube.mjs'
import {buscarUltimaFacturaIspCube} from './buscarUltimaFacturaIspCube.mjs'
import { mediosDePagoIspCube } from './mediosDePagoIspCube.mjs'
import { tecnicos,verificarSiEsTecnico } from '../controladoresNodo/tecnicosLiryc.mjs'
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
let nombreCliente = {};
let direccionCliente = {};
let telefonoCliente = {};
let telefono2Cliente = {};
let emailCliente = {};
let planCliente = {};
export let habilitarFoto = {};
export let habilitarNombre = {};
export let habilitarPass = {};
const intentosPorCliente = {};
const tecnico = {};
export const  recorrerArbol = async (telefono, nodoActual, mensaje, datos, menuActual, numeroActual, opcion, instancia, contact, menuFinal, otros, mensajeCompleto) => {
  // console.log(mensajeCompleto, " mensaje en recorrer arbol")
 var tipodeinternet=0;

  if (mensaje==="0" && menuActual!=="raiz" && menuActual!=="opcionEsCliente"){

   
    client.sendMessage(telefono,menuPrincipal);
    guardarNodoActual(telefono,'opcionEsClienteLogeado','logeado',datos,opcion,'',menuFinal,otros);
    return {notificaOperador: false, datos: {}, menu: "opcionEsClienteLogeado"};


  }
  if (instancia === 'confirmar') {
    if(menuActual === 'opcionComprobante'){
     // opcionComprobanteDePago(telefono, mensaje, opcion, menuFinal, otros, datos, mensajeCompleto.type)
    }else{
      confirmarDatos(telefono, mensaje, opcion, menuFinal, otros, datos);
      if(menuFinal === 'Inconvenientes con el servicio' || menuFinal === 'Consulta tecnica'){
        comprobarTelefono(telefono, 'tecnico');
    }
      enviarRespuesta(telefono,
`📡 Derivé tu consulta a uno de nuestros representantes
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Nuevanet 👩‍🦰`);
      limpiarTelefonoMenuCliente(telefono);
    return {notificaOperador: true, datos: {}, menu: menuActual}
    }
      
  }else if (menuActual === 'confirmarDatosClienteIspCube') { 
    const maxIntentos = 3; // Máximo de intentos permitidos
    const regex = /^\d+$/; // Expresión regular para validar solo números
    const mensajesIntentos = [
        "Parece que hubo un error. Recuerde ingresar solo su DNI o CUIT en números.",
        "Por favor, verifique e intente ingresar solo su DNI o CUIT en números.",
        "Último intento: asegúrese de ingresar solo los números de su DNI o CUIT, sin letras ni símbolos."
    ];
    const mensajesNoEncontrado = [
        "No encontramos su DNI o CUIT en nuestros registros. Verifique y vuelva a intentarlo.",
        "Aún no encontramos su DNI o CUIT. Asegúrese de que sea correcto.",
        "Último intento: no se encontró su DNI o CUIT. Por favor, verifique nuevamente."
    ];

    // Función para validar solo números
    const esNumeroValido = (input) => regex.test(input);

    // Inicializar contador de intentos para el cliente si no existe
    if (!intentosPorCliente[telefono]) {
        intentosPorCliente[telefono] = 0;
    }

    // Verificar si el mensaje contiene solo números
    if (!esNumeroValido(mensaje)) {
        intentosPorCliente[telefono] += 1;

        // Verificar si se alcanzó el límite de intentos
        if (intentosPorCliente[telefono] > maxIntentos) {
            intentosPorCliente[telefono] = 0; // Restablecer el contador
            guardarNodoActual(telefono, "clienteConfirmaIspError", numeroActual, "", opcion, instancia, menuFinal, otros);
            client.sendMessage(telefono, "Lo siento. Por favor, intente más tarde.");
            comprobarTelefono(telefono, "admin");
            limpiarTelefonoMenuCliente(telefono);
            return { notificaOperador: true, datos: "ERROR_DNI", menu: menuActual };
        }

        // Notificar al cliente sobre el error y mostrar mensaje correspondiente
        client.sendMessage(telefono, mensajesIntentos[intentosPorCliente[telefono] - 1]);
        return { notificaOperador: false, datos: {}, menu: menuActual };
    }

    // Verificar si el cliente es técnico
    tecnico[telefono] = await verificarSiEsTecnico(mensaje || datos);

    if (tecnico[telefono]) {
        // Manejar caso técnico
        guardarNodoActual(telefono, "tecnicoLogeado", 'opciontecnico', '', 'logeado', "tecnicoConfirmado", menuFinal, otros);
        enviarRespuesta(telefono, tecnicoLogeado.respuesta = `👨‍🔧 Bienvenido al Área Técnica, ${tecnico[telefono].name} 👋

¿Cómo puedo ayudarte hoy?

1️⃣ Cargar cliente  
2️⃣ Habilitar conexión`);
        return { notificaOperador: false, datos: {}, menu: 'tecnicoLogeado' };
    } else {
        // Intentar loguear al cliente
        const clienteLogeado = await logearClienteIspCube(telefono, mensaje, datos);
        if (clienteLogeado.success) {
            const datos = clienteLogeado.clientData;

            guardarNodoActual(telefono, "clienteConfirmaIspOk", numeroActual, mensaje, datos.status, "clienteConfirmaIspOk", 'logeado', datos.id);
            client.sendMessage(telefono, encuentraDNIMensaje(datos));
            setTimeout(() => { client.sendMessage(telefono, opcionEsClienteLogeado.respuesta); }, 1500);

            // Restablecer contador de intentos al loguear exitosamente
            intentosPorCliente[telefono] = 0;
        } else {
            // Incrementar intentos al no encontrar cliente
            intentosPorCliente[telefono] += 1;

            // Verificar si se alcanzó el límite de intentos
            if (intentosPorCliente[telefono] > maxIntentos) {
                intentosPorCliente[telefono] = 0; // Restablecer contador
                guardarNodoActual(telefono, "clienteConfirmaIspError", numeroActual, "", opcion, instancia, menuFinal, otros);
                client.sendMessage(telefono, "Lo sentimos, no encontramos su DNI o CUIT en nuestros registros.");
                comprobarTelefono(telefono, "ventas");
                limpiarTelefonoMenuCliente(telefono);
                return { notificaOperador: true, datos: "DNI NO ENCONTRADO", menu: menuActual };
            }

            // Notificar al cliente que no se encontró el DNI o CUIT
            client.sendMessage(telefono, mensajesNoEncontrado[intentosPorCliente[telefono] - 1]);
            return { notificaOperador: false, datos: {}, menu: menuActual };
        }
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
      if(menuActual === 'facturaConfirmaIspOk' ||  menuActual==="opcionMediosDePago"){  // vuelve al menu despues mostrar factura
        nodoActual = arbolRespuestas;
        menuActual = 'administracion';
        numeroActual = '3';
        mensaje = mensaje;
      }
      if(menuActual === 'facturaConfirmaIsError'){  // vuelve al menu despues mostrar factura
        nodoActual = arbolRespuestas;
        menuActual = 'administracion';
        numeroActual = '1';
        mensaje = mensaje;
      }
      if(menuActual === 'consultaSinServicio'){  // vuelve al menu despues mostrar factura
        nodoActual = arbolRespuestas;
        menuActual = 'consultaSinServicio';
        numeroActual = '1';
        mensaje = "1";
      }
      if(menuActual === 'InconvenientesConElServicio'){  // vuelve al menu despues mostrar factura
        nodoActual = arbolRespuestas;
        menuActual = 'InconvenientesConElServicio';
        numeroActual = '2';
        mensaje = "1";
      }

  /*    if(menuActual === 'administracion' && mensaje === '1'){
        buscarUltimaFacturaIspCube(telefono,mensaje,opcion,menuFinal,"",datos);
      //  return {notificaOperador: false, datos: {}};
    }
      */

      if(menuActual === 'sinServicio'){  // vuelve al menu despues mostrar factura
       
        if (mensaje==="1"){
          tipodeinternet="El cliente tiene internet por fibra optica"
        }
        else{
           tipodeinternet="El cliente tiene internet por Antena"
        }
      
      }


      if(menuActual === 'usuario fibra o antena'){  // vuelve al menu despues mostrar factura
        nodoActual = arbolRespuestas;
        
        numeroActual = '1';
        mensaje = "1";
      }
      //--------------------------------------------------Nuevi Eduardo---------------------------------------------------------

if(menuActual === 'tecnicoLogeadoOpcion1'){  // vuelve al menu despues mostrar factura
  nodoActual = arbolRespuestas;
  menuActual = 'tecnicoLogeadoOpcion1';
  numeroActual = '1';
  mensaje = "2";
  nombreCliente[telefono]=mensajeCompleto.body;
}
if(menuActual === 'tecnicoLogeadoDireccion'){  // vuelve al menu despues mostrar factura
  nodoActual = arbolRespuestas;
  menuActual = 'tecnicoLogeadoDireccion';
  numeroActual = '2';
  mensaje = "3";
  direccionCliente[telefono]=mensajeCompleto.body;
}
if(menuActual === 'tecnicoLogeadoTelefono'){  // vuelve al menu despues mostrar factura
  nodoActual = arbolRespuestas;
  menuActual = 'tecnicoLogeadoTelefono';
  numeroActual = '3';
  mensaje = "4";
  telefonoCliente[telefono]=mensajeCompleto.body;
}
if(menuActual === 'tecnicoLogeadoTelefono2'){  // vuelve al menu despues mostrar factura
  nodoActual = arbolRespuestas;
  menuActual = 'tecnicoLogeadoTelefono2';
  numeroActual = '4';
  mensaje = "5";
  telefono2Cliente[telefono]=mensajeCompleto.body;
}
if(menuActual === 'tecnicoLogeadoEmail'){  // vuelve al menu despues mostrar factura
  nodoActual = arbolRespuestas;
  menuActual = 'tecnicoLogeadoEmail';
  numeroActual = '5';
  mensaje = "6";
  emailCliente[telefono]=mensajeCompleto.body;
}
if(menuActual === 'tecnicoLogeadoPlan'){  // vuelve al menu despues mostrar factura
  nodoActual = arbolRespuestas;
  menuActual = 'tecnicoLogeadoPlan';
  numeroActual = '6';
 
  planCliente[telefono]=mensajeCompleto.body;
  enviarRespuesta(telefono,"✅ Los datos del cliente se han almacenado correctamente en el sistema.");
  comprobarTelefono(telefono, "tecnico");
  limpiarTelefonoMenuCliente(telefono);
  return {notificaOperador: true,datos: {nombreCliente, direccionCliente, telefonoCliente,telefono2Cliente,emailCliente,planCliente, tecnico}, menu: menuActual };;
}

if(menuActual === 'tecnicoLogeadoOpcion2'){  // vuelve al menu despues mostrar factura
   
  nodoActual = arbolRespuestas;
 // menuActual = 'tecnicoLogeadoEmail';
  numeroActual = '2';
  mensaje = "3";
habilitarNombre[telefono]=mensajeCompleto._data.body;
  //return {notificaOperador: false,datos: {}, menu: 'tecnicoLogeadoOpcion2' };
}
if(menuActual === 'tecnicoLogeadoRedWifi'){  // vuelve al menu despues mostrar factura
  nodoActual = arbolRespuestas;
  //menuActual = 'tecnicoLogeadoEmail';
  numeroActual = '3';
  mensaje = "4";
  //habilitarNombre[telefono]=mensajeCompleto._data.body;
  habilitarPass[telefono]=mensajeCompleto._data.body;
  
}
if(menuActual === 'tecnicoLogeadoPassWifi'){  // vuelve al menu despues mostrar factura
  nodoActual = arbolRespuestas;
 // menuActual = 'tecnicoLogeadoEmail';
  numeroActual = '4';
 mensaje = "5";
//habilitarPass[telefono]=mensajeCompleto._data.body;
//comprobarTelefono(telefono, "tecnico");
//limpiarTelefonoMenuCliente(telefono);
//return {notificaOperador: true,datos: {habilitarFoto, habilitarNombre, habilitarPass}, menu: 'tecnicoLogeadoRedWifi' };

}
//------------------------------NUEVO lYRIC--------------------------------------------
        
//-----------------------------------------------------------------------------------------------------------
      if(menuActual === 'opcionComprobante'){
        if (mensajeCompleto.type !== 'chat'){
            //si posee imagen o archivo, informar que se registro comprobante
            //guardar mensaje en base de datos
            //guardar nodo actual para luego enviar a menu principal o finalizar chat.
            enviarRespuesta(telefono,"Registramos tu comprobante de pago!");
            client.sendMessage(telefono,menuVolver);
        
            //comprobarTelefono(telefono, "cobranza");

        }else {
            enviarRespuesta(telefono,"No pudimos registrar tu comprobante ❌Intenta nuevamente enviando una imagen, foto o archivo valido");
            client.sendMessage(telefono,menuVolver);
            guardarNodoActual(telefono,'informarPago','',datos,opcion,instancia,menuFinal,otros);
      
    }
    guardarNodoActual(telefono,'administracion','3',datos,opcion,'',menuFinal,otros);
    return {notificaOperador: false, datos: {}, menu: "administracion"};
  }


    
//-----------------------------------------------------------------------------------------------------------

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
       
                  


                if(siguienteNodo.getMenu() === 'raiz'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, 'confirmarDatosClienteIspCube', siguienteNodo.getNumero(), datos, opcion, '', menuFinal, otros);
               
                }
                else if(siguienteNodo.getMenu() === 'consultaSinServicio'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, 'deriva', "", otros);
                }
                else if(siguienteNodo.getMenu() === 'InconvenientesConElServicio'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, 'deriva', "", otros);
                }
                else if(siguienteNodo.getMenu() === 'usuario fibra o antena'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, 'deriva', "", otros);
                  enviarRespuesta(telefono, siguienteNodo.getRespuesta());
                  return {notificaOperador: true, datos:{ tipodeinternet}, menu: siguienteNodo.menu};
           
                 

                }
                else if(siguienteNodo.getMenu() === 'opcionComprobante'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, '', "", otros);
                }
                else if(siguienteNodo.getMenu() === 'tecnicoLogeadoOpcion1'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, '', "", otros);
                }else if(siguienteNodo.getMenu() === 'tecnicoLogeadoDireccion'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, '', "", otros);
                }else if(siguienteNodo.getMenu() === 'tecnicoLogeadoTelefono'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, '', "", otros);
                }else if(siguienteNodo.getMenu() === 'tecnicoLogeadoTelefono2'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, '', "", otros);
                }else if(siguienteNodo.getMenu() === 'tecnicoLogeadoEmail'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, '', "", otros);
                }else if(siguienteNodo.getMenu() === 'tecnicoLogeadoPlan'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, '', "", otros);
                }else if(siguienteNodo.getMenu() === 'tecnicoLogeadoOpcion2'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, '', "", otros);
               
                }else if(siguienteNodo.getMenu() === 'tecnicoLogeadoRedWifi'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, '', "", otros);
               
                }else if(siguienteNodo.getMenu() === 'tecnicoLogeadoPassWifi'){ //flujo de sidecom para logear cliente con ispcube
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, '', "", otros);

                }
                
                
                else{ //flujo normal 
                  guardarNodoActual(telefono, siguienteNodo.getMenu(), siguienteNodo.getNumero(), datos, opcion, 'confirmar', devolverOpcionSeleccionada(mensaje, menuActual), otros);
                }
              enviarRespuesta(telefono, siguienteNodo.getRespuesta());
          } else if (!siguienteNodo.pideDatos && !siguienteNodo.pideOpcion) { // FLUJO NORMAL
            // console.log(menuActual, "menu actual", mensaje, "mensaje")
             if(menuActual === 'administracion' && mensaje === '4'){ //medios de pago
              mediosDePagoIspCube(telefono, mensaje, opcion, menuFinal, otros, datos)
            }
            else if(menuActual === 'administracion' && mensaje === '1'){ //reenvio factura
              buscarUltimaFacturaIspCube(telefono, mensaje, opcion, menuFinal, otros, datos)
            }
        
            else{
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
             if( siguienteNodo.getMenu()==="ServicioDeriva"){
              return {notificaOperador: true, datos:{}, menu: siguienteNodo.menu};
             }
             if( siguienteNodo.getMenu()==="DerivaInconvenientesConElServicio"){
              return {notificaOperador: true, datos:{}, menu: siguienteNodo.menu};
             }
             if( siguienteNodo.getMenu()==="DerivaArraydeServicio"){
              return {notificaOperador: true, datos:{ tipodeinternet}, menu: siguienteNodo.menu};
             }
             if(siguienteNodo.getMenu() === 'tecnicoLogeadoDatosCargados'){ //flujo de sidecom para logear cliente con ispcube
              return {notificaOperador: true, datos:{}, menu:'tecnicoLogeadoDatosCargados'};
           
           }
            
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
        else if(menuActual === 'sinServicio'){
          return {notificaOperador: true, datos: {mensaje}, menu: menuActual};
        }
         
      }
  }

};
