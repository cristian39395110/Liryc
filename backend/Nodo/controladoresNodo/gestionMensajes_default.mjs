import insertDataMensaje from "../../controladores/insertDataMensaje.mjs";
// import formatoDiaHora from "../../controladores/formatoDiaHora.mjs";
import { guardarContacto } from "../../controladores/guardarContacto.mjs";
import {manejarError} from "./manejarError.mjs"
// import colors from "colors/safe.js"
import con from "../../database/conexion.mjs";
import {buscarNodoActual} from "./buscarNodoActual.mjs"
import {actualizarTextoArbolRespuestas} from "./actualizarTextoArbolRespuestasSidecom.mjs"
import {recorrerArbol} from "./recorrerArbolSidecom.mjs"
import {respuestaNoEncontrada} from "../arbolCliente/respuestaNoEncontradaSidecom.mjs"
import { arbolRespuestas } from "../arbolCliente/respuestasSidecom.mjs";
// import {opcionEsClienteLogeado} from '../arbolCliente/respuestasSidecom.mjs'
// import { comprobarTelefono } from "../../controladores/comprobarTelefono.mjs";
import { promisify } from 'util';
let RANGOMENSAJE = "medusa";
export async function gestionMensajes(mensaje, texto, telefon, client) {
    let CONTACTOACTUALGLOBAL = "";
    var rangoCLienteActivo = "";
    try {
      var telefono = telefon;
      const msj = texto.toLowerCase().trim(); // Convertir el mensaje a minúsculas y eliminar espacios en blanco al principio y al final
      var nombreUsuario = "usuario";
      RANGOMENSAJE = "usuario";
      const contact = await mensaje.getContact();
      CONTACTOACTUALGLOBAL = contact.pushname;
      await guardarContacto(
        contact.pushname,
        telefon,
        await client.getProfilePicUrl(mensaje.from),
        client
      ); // COMPRUEBA SI EL CLIENTE ES UN CONTACTO Y SI NO LO ES LO CREA.
      // console.log(
      //   colors.green(
      //     "-------------------------------------------------------------" +
      //       "\nmensaje: " +
      //       msj +
      //       "\nnombre: " +
      //       mensaje["_data"].notifyName +
      //       "\nnumero: " +
      //       telefono +
      //       "\nnumero: " +
      //       formatoDiaHora(mensaje.timestamp)
      //   )
      // );
      var exiteUsuario =
        "SELECT telefono, rango FROM clientesactivo WHERE telefono = '" + telefono + "'";
      con.query(exiteUsuario, function (err, result) {
        if (err) {
          client.sendMessage(
            "5492664840533@c.us",
            "Crasheo el gestionMensajes\n" + err
          );
          return console.log("error en gestionMensajes");
        }
        // Si el usuario es un CLIENTE ACTIVO
        // Actualización de la fecha del último mensaje del cliente
        
        if (result.length > 0) { 
          rangoCLienteActivo = result[0].rango;
          //si el cliente tarda en responder
          var fecha = new Date().getTime();
          var sql =
            "UPDATE clientesactivo SET fechaMensaje='" +
            fecha +
            "' WHERE telefono = '" +
            telefono +
            "'";
          con.query(sql, function (err, result) {
            if (err) {
              client.sendMessage(
                "5492664840533@c.us",
                "Crasheo el gestionMensajes\n" + err
              );
              return console.log("error en gestionMensajes");
            }
            // console.log(
            //   "update de clienteActivo, fechaMensaje where telefono",
            //   fecha,
            //   telefono
            // );
          });
          con.query("SELECT MAX(idMensaje) as ultimoId FROM mensajes", function(err, ultimoId){
            if (err) {
              client.sendMessage(
                "5492664840533@c.us",
                "Crasheo el get /filtroRango\n" + err
              );
              return console.log("error en hacerFiltroRango");
            }
            let ultimoIdActivo = ultimoId[0].ultimoId
          insertDataMensaje(mensaje, 1, RANGOMENSAJE, nombreUsuario, rangoCLienteActivo, true, ultimoIdActivo);
          });
        } else { 
          // console.log("NO ES UN CLIENTE ACTIVO")
          // SI NO ES UN CLIENTE ACTIVO

          //*****LOGICA PARA UNIPESONAL***** 
          //SI NO ES UN CONTACTO ACTIVO, LO METO DENTRO DE CONTACTOS ACTIVOS.
          // comprobarTelefono(telefono, 'admin', '');
          //*****LOGICA PARA UNIPESONAL***** 


          //*******LOGICA PARA CHATBOT******
          // Lógica para manejar el árbol de respuestas según el mensaje recibido (BUSCA EN EL ARBOL EL MENSAJE A RESPONDER)
          buscarNodoActual(telefono, async (menuActual) => {
           
            // Lógica para manejar el árbol de respuestas según el mensaje recibido
            if (msj === "hola") { // || msj === "0"
              // Si el cliente envía "hola" o 0, iniciamos el árbol desde el nodo raíz
              actualizarTextoArbolRespuestas(CONTACTOACTUALGLOBAL);
              recorrerArbol(
                telefono,
                arbolRespuestas,
                "hola",
                "",
                "raiz",
                "hola",
                "",
                "",
                contact,
                ''
              );
              mensaje.body = "Menu principal";
            } else {
              // let nodoActual = await arbolRespuestas.buscarOpcion(menuActual, msj);
              // console.log(nodoActual, "nodoActual cuando comienza");
              if (menuActual !== null) {
               
                let resp = await recorrerArbol(
                  telefono,
                  arbolRespuestas,
                  msj, //mensaje actual
                  menuActual.datos, // datos ingresados por el cliente
                  menuActual.menu, // nombre del menu
                  menuActual.numero, //opcion que invoca la respuesta
                  menuActual.opcion, // opcion seleccionada por el cliente
                  menuActual.instancia, // instancia, por ejemplo si esta por confirmar datos
                  contact, // contacto de whatsapp
                  menuActual.menuFinal, // ultimo menu donde estuvo el cliente
                  menuActual.otros, // otros datos que se pueden guardar
                  mensaje
                );
                if (resp !== false) {
                  if (resp !== undefined) {
                    mensaje.body = resp.menu;
                  } else {
                    mensaje.body = msj;
                  }
                } else {
                  console.log("menu:",menuActual.menu, "menseajee body:", mensaje.body);
                  if (
                    menuActual.menu === "Consulta tecnica" || menuActual.menu === "Inconvenientes con el servicio") { //&& mensaje.body === "1"
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
                  } else {
                    respuestaNoEncontrada(telefono, contact);
                  }
                }
              } else {
                let resp = await recorrerArbol(
                  telefono,
                  arbolRespuestas,
                  msj,
                  "",
                  "",
                  "",
                  "",
                  "",
                  contact,
                  ""
                );
                if (resp !== false) {
                  if (resp !== undefined) {
                    mensaje.body = resp.menu;
                  } else {
                    mensaje.body = msj;
                  }
                }
                // }else{
                //   mensaje.body = `El cliente esta solicitando un asistencia:
                //   -Datos personales: ${menuActual.datos}
                //   -Motivo: ${menuActual.opcion}`;
                //   console.log("entra al else no cuentra 2")
                // }
              }
            }
          });
          //*******LOGICA PARA CHATBOT******
          con.query("SELECT MAX(idMensaje) as ultimoId FROM mensajes", function(err, ultimoId){
            if (err) {
              client.sendMessage(
                "5492664840533@c.us",
                "Crasheo el get /filtroRango\n" + err
              );
              return console.log("error en hacerFiltroRango");
            }
            let ultimoIdMensaje = ultimoId[0].ultimoId
          insertDataMensaje(mensaje, 1, RANGOMENSAJE, nombreUsuario, rangoCLienteActivo, false, ultimoIdMensaje);
          })
        }
        // Actualización del estado del mensaje en la base de datos
      //  console.log(rangoCLienteActivo, "antes llamar a insert")
       
      });
       
    
    } catch (error) {
      // Manejo de errores
      manejarError(error);
    }
  }