import con from '../database/conexion.mjs'
import removeAccents from './removeAccents.mjs'
import formatoDiaHora from './formatoDiaHora.mjs'
import descargarMedia from './descargarMedia.mjs'
import obtenerClienteDeWhatsapp from '../conexionWhatsapp/conexionW.js'
const client = obtenerClienteDeWhatsapp(null, false);
import subirImagenOperador from './subirImagenOperador.mjs'
import io from '../sockets/sockets.mjs'
import { hacerFiltroRango } from '../sockets/hacerFiltroRango.mjs'
import fs from 'node:fs';
import { habilitarFoto, habilitarNombre, habilitarPass } from '../Nodo/controladoresNodo/recorrerArbolLliryc.mjs'


//FUNCION PARA INSERTAR LOS MENSAJES EN LA BASE DE DATOS
export default async (mensaje, estado, rangoDefault, nnombreUsuario, rangoClienteActivo, esClienteActivo, ultimoId) =>{ 
    // console.log(estado, mensaje.body, "estado");
    const start = Date.now();
    var formatted = new Date().getTime();
    var fecha = new Date();
    var diaBuscar = fecha.getDate();
    diaBuscar = diaBuscar.toString().padStart(2, '0');
    var mesBuscar = fecha.getMonth()+1;
    mesBuscar = mesBuscar.toString().padStart(2, '0');
    var añoBuscar = fecha.getFullYear();
    
          
    var contact = "";
    var telefono = "";
    var msj = "";
    var dispositivo = "";
    var fecha = "";
    var rangoOperador = "";
    var nombreUsuario = "";
    var fechaBuscar = "";
    // console.log(colors.red(mensaje));
  
    var imgurl = "";
  // console.log(message.id.id)
    if (mensaje.hasMedia && mensaje['_data'].type === 'image'){ 
      imgurl = 'imagen/' + mensaje.id.id + ".jpg";
      await descargarMedia(mensaje, imgurl);
    }else if (mensaje.hasMedia && mensaje['_data'].type === 'video'){
      imgurl = 'video/' + mensaje.id.id + ".mp4";
      await descargarMedia(mensaje, imgurl);
    }else if (mensaje.hasMedia && mensaje['_data'].type === 'ptt'){
      imgurl = 'audio/' + mensaje.id.id + ".wav";
      await descargarMedia(mensaje, imgurl);
    }else if (mensaje.hasMedia && mensaje['_data'].type === 'document'){
      imgurl = 'documentos/' + mensaje.body;
      await descargarMedia(mensaje, imgurl);
    }else if (mensaje.hasMedia && mensaje['_data'].type === 'sticker'){
      imgurl = 'imagen/' + mensaje.id.id + ".jpg";
      await descargarMedia(mensaje, imgurl);
    }
    
    
    if(estado == 1){ //cliente
      fechaBuscar = diaBuscar+'-'+mesBuscar+'-'+añoBuscar;
      var urlPerfil = ''//await client.getProfilePicUrl(mensaje.from);
      if(esClienteActivo){
        var sql="UPDATE clientesactivo SET bool='"+1+"',Fecha='"+formatted+"', nuevoMensaje='"+1+"' WHERE telefono = '"+mensaje.from+"'";
        con.query(sql, function (err, result) {
          if (err) {
            
            client.sendMessage('5492664840533@c.us', 'Crasheo el insertDataMensaje\n' + err);
              return console.log("error en insertDataMensaje");
          }
          // console.log("1 record updated");
        });
      }
      
        contact = mensaje.nombre;//await mensaje.getContact();     
        // contact = contact.pushname;
  
        telefono = mensaje.from;
        // console.log(mensaje.from)
        msj = mensaje.body;
        dispositivo = mensaje.deviceType;
        fecha = formatoDiaHora(mensaje.timestamp); 
          rangoOperador = rangoDefault;
        nombreUsuario = "usuario";
  

        // console.log(mensaje.body, "antes del if", mensaje.body.includes("Solicitando asistencia:"));

        //con el nombre del menu de cada nodo podes controlar si queres que salga un cartel verde o azul con la el nombre del menu. 
        //el solicitando asistencia se complementa en gestionmensajes.mjs donde se filtra y se agregan titulos a las opciones del cliente
 

        if(!esClienteActivo){
      if(mensaje.body.includes("SOLICITANDO ASISTENCIA:")){
        estado = 3;
        nombreUsuario = "medusa";
      }
      else if(mensaje.body.includes("Quiero ser cliente!")){
        estado = 2;
        nombreUsuario = "medusa";
        msj = 'Esta persona no es cliente y desea conocer o contratar nuestros servicios!'
      }
     /* else if(mensaje.body.includes("sinServicio")){
        estado = 3;
        nombreUsuario = "medusa";
        //msj = 'El cliente se encuentra sin servicio en este momento, necesita asistencia.'+ mensaje.body;
      }
        */
      else if(mensaje.body.includes('Intalar TV Digital Sensa')){
        estado = 3;
        nombreUsuario = "medusa";
        msj = "El cliente necesita asistencia para instalar el servicio de TV DIGITAL - SENSA";
      }
      else if(mensaje.body.includes('ventasLogeado')){
        estado = 3;
        nombreUsuario = "medusa";
        msj = "El cliente esta interesado en contratar nuevos servicios";
      }
      // if(mensaje.body.includes('opcionReenvioFactura')){
      //   estado = 3;
      //   nombreUsuario = "medusa";
      //   msj = "El cliente solicita que le reenvien su factura";
      // }
      else if(mensaje.body.includes('adherirDebito')){
        estado = 3;
        nombreUsuario = "medusa";
       
      }
      else if(mensaje.body.includes('opcionPromesaDePago')){
        estado = 3;
        nombreUsuario = "medusa";
        msj = "El cliente desea informar una promesa de pago";
      }
      else if(mensaje.body.includes('SU RECLAMO ES')){
        estado = 3;
        nombreUsuario = "medusa";
      
      }
      
      else if(mensaje.body.includes('opcionConsultasAdministracion')){
        estado = 3;
        nombreUsuario = "medusa";
        msj = "El cliente solicita asistencia administrativa por consultas sobre su cuenta o su servicio.";
      } else if(mensaje.body.includes("El cliente solicita información")){
        estado = 3;
        nombreUsuario = "medusa";
      } else if(mensaje.body.includes("El cliente adjunta Foto")){
        estado = 3;
        nombreUsuario = "medusa";
      } else if(mensaje.body.includes("Técnico que tomó los datos")){
        estado = 3;
        nombreUsuario = "medusa";
      }  else if(mensaje.body.includes("tecnicoLogeadoPassWifi")){
        estado = 3;
        nombreUsuario = "medusa";

        msj = `Habilitar Conexión:
      Nombre: ${habilitarNombre[telefono]}
      Password: ${habilitarPass[telefono]}`; 

       
      }else if(mensaje.body.includes("Error en el DNI ingresado")){
        estado = 3;
        nombreUsuario = "medusa";
      }
      else if(mensaje.body.includes("otrasConsultas")){
        estado = 3;
        nombreUsuario = "medusa";
      }
     
      else if(mensaje.body.includes("DNI NO ENCONTRADO")){
        estado = 3;
        nombreUsuario = "medusa";
      }
    }

  

    if (mensaje.type === 'call_log'){
      estado = 3;
      nombreUsuario = 'medusa'
      msj = `El cliente esta intentado hacer una llamada.`;
    }
    else if (mensaje.type === 'vcard'){
      const nameMatch = mensaje.body.match(/FN:(.+)/); // Extrae el nombre
      const phoneMatch = mensaje.body.match(/TEL.*:(.+)/); // Extrae el teléfono

      const name = nameMatch ? nameMatch[1].trim() : 'Nombre no encontrado';
      const phone = phoneMatch ? phoneMatch[1].replace(/[^\d]/g, '') : 'Teléfono no encontrado';

      estado = 3;
      nombreUsuario = 'medusa'
      msj = `El cliente esta ha enviado un contacto.
      Nombre: ${name}
      Teléfono: ${phone}`;
    }
    else if (mensaje.type === 'location'){
      estado = 3;
      nombreUsuario = 'medusa'
      msj = `https://www.google.com/maps?q=${mensaje.location.latitude},${mensaje.location.longitude}`;
      const base64Data = mensaje.body;

    if (base64Data) {
      imgurl = "imagen/" + mensaje.id.id + ".jpg"; ;

      fs.writeFile(`${imgurl}`, base64Data, 'base64', (err) => {
        if (err) {
          console.log("Error al escribir el archivo", err);
        } 
      });
    } else {
      console.log("No se encontraron datos en el body para procesar.");
    }
  }
    }else{ // MEDUSA (MENSAJE ENVIADO DESDE LA INTERFAZ)
      if(esClienteActivo){
        var sql="UPDATE clientesactivo SET bool='"+0+"',Fecha='"+formatted+"', nuevoMensaje='"+0+"' WHERE telefono = '"+mensaje.telefono+"'";
        con.query(sql, function (err, result) {
          if (err) {
            client.sendMessage('5492664840533@c.us', 'Crasheo el insertDataMensaje\n' + err);
            return console.log("error en insertDataMensaje");
          }
          //  console.log("1 record updated", estado);
        });
      }
     
      contact = mensaje.nombre;
  
      telefono = mensaje.telefono.replace('+', '');
      msj = mensaje.mensaje;
      fecha = mensaje.fecha;
      fechaBuscar = mensaje.fechaBuscar;
      dispositivo = mensaje.dispositivo;
      rangoOperador = mensaje.rango;
      nombreUsuario = mensaje.nombreUsuario;
      
      if(mensaje.enviaArchivo){
        imgurl = 'subir/'+msj;
        subirImagenOperador(telefono, msj);
      }else{
        try{
          if(!telefono.includes('N/A')){
            client.sendMessage(telefono, msj);
          }else{
            return console.log("el telefono ",telefono," no es valido");
          }
          
        }catch(e){
          
        }
      }

    }
    if(contact == undefined || contact == null || contact == ""){ 
      contact = "desconocido";
      
    }
    else{
      contact = removeAccents(contact);
      contact = contact.replace(/'/g, "");
      contact = contact.replace(/"/g, "");
      contact = contact.replace(/\\/g, "");
      // contact = contact.replace(/\?/g, "");
    }
    msj = msj.replace(/'/g, "");
    msj = msj.replace(/"/g, "");
    msj = msj.replace(/\\/g, "");
    // msj = msj.replace(/\?/g, "");
    var urlPerfil = ''//await client.getProfilePicUrl(telefono);
   
    var sql = "INSERT INTO mensajes (nombre, telefono, fecha, fechaBuscar, mensaje, dispositivo, imgurl, estado, rangoMensaje,urlPerfil, nombreUsuario) VALUES('"+contact+"','"+telefono+"','"+fecha+"','"+fechaBuscar+"','"+msj+"','"+dispositivo+"','"+imgurl+"','"+estado+"','"+rangoOperador+"','"+urlPerfil+"','"+nombreUsuario+"')";
    con.query(sql, function (err, result) {
      if (err) {
        
        client.sendMessage('5492664840533@c.us', 'Crasheo el insertDataMensaje\n' + err);
        return console.log("error en insertDataMensaje");
      }
    //   console.log(colors.yellow("mensaje registrado"));
    // console.log(rangoClienteActivo, "fuera")
    if(esClienteActivo){
      if(rangoClienteActivo !== 'admin'){
        let roomRangoActivo = io.sockets.adapter.rooms.get(rangoClienteActivo); // Obtener la room por nombre
          if (roomRangoActivo && roomRangoActivo.size > 0) { 
              hacerFiltroRango(con, false, ultimoId, rangoClienteActivo, function (data, ultimoId) {
              //  console.log(rangoClienteActivo, "dentro")
                io.to(rangoClienteActivo).emit("mensajes", data, ultimoId);
              const end = Date.now();
              console.log(`insertDataMensaje ${rangoClienteActivo}: ${end - start} ms`);
              
            });
          }
      }
      let roomRangoAdmin = io.sockets.adapter.rooms.get('admin'); // Obtener la room por nombre
      if (roomRangoAdmin && roomRangoAdmin.size > 0) { 
        hacerFiltroRango(con, false, ultimoId, 'admin' , function (data, ultimoId) {
        
          io.to('admin').emit("mensajes", data, ultimoId);
           const end = Date.now();
           console.log(`insertDataMensaje ADMIN: ${end - start} ms`);
        });
      }
    }else {
      // Si no es cliente activo, puedes asegurarte de finalizar los temporizadores aquí también
    const end = Date.now();
      console.log(`insertDataMensaje NO ACTIVO: ${end - start} ms`);
  }
    
    
    });
  
  }