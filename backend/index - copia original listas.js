//*********************LLAMADAS A LIBRERIAS*******************/

const express = require('express');
const cors = require('cors');
var network = require('network');
const app = express();
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '25mb'})); //setea la cantidad de mb que soporta el req
app.use(bodyParser.urlencoded({limit: '25mb', extended: true}));
app.listen(8081, () => {
    console.log('Server on port 8081'); // a futuro usar el puerto 8081
});
let animacionCargaPrimero;
let animacionCargarSegundo;
let animacionCargarTercero;

const qrcode = require('qrcode-terminal'); // ver qr por consola
const fs = require('fs'); // file system
var colors = require('colors/safe'); //añade color a los mensajes de consola
const { Client, LocalAuth, Product, Buttons, MessageMedia, List } = require('whatsapp-web.js'); // importa las librerias de whatsapp
const client = new Client({ // crea un cliente de whatsapp
    authStrategy: new LocalAuth()
});
var mysql = require('mysql'); // importa la libreria de mysql
const { ClientRequest, get } = require('http'); // importa la libreria de http
const { timeout } = require('async'); 
const { message } = require('statuses');
const { response } = require('express');
const { url } = require('inspector');
var con = mysql.createConnection({ //CREA LA CONEXION CON LA BASE DE DATOS
    host: "localhost",
    user: "root",
    password: "",
    database: "wsp",
    charset : 'utf8mb4'
    });
 con.connect(function(err) {
  if (err) throw err;
  console.log(colors.green(`
  ::::    ::::  :::::::::: :::::::::  :::    :::  ::::::::      :::     
  +:+:+: :+:+:+ :+:        :+:    :+: :+:    :+: :+:    :+:   :+: :+:   
  +:+ +:+:+ +:+ +:+        +:+    +:+ +:+    +:+ +:+         +:+   +:+  
  +#+  +:+  +#+ +#++:++#   +#+    +:+ +#+    +:+ +#++:++#++ +#++:++#++: 
  +#+       +#+ +#+        +#+    +#+ +#+    +#+        +#+ +#+     +#+ 
  #+#       #+# #+#        #+#    #+# #+#    #+# #+#    #+# #+#     #+# 
  ###       ### ########## #########   ########   ########  ###     ### 
  `)); 
  const espera = ["|", "/", "-", "\\"];
  let indice = 0;

  animacionCargaPrimero = setInterval(() => {
  process.stdout.write("\rEspere un momento... "  + espera[indice]);
  indice = (indice + 1) % espera.length;
}, 250);
setTimeout(() => {
  clearInterval(animacionCargaPrimero);
animacionCargarSegundo = setInterval(() => {
  process.stdout.write("\rCargando componentes... "  + espera[indice]);
  indice = (indice + 1) % espera.length;
}, 250);
},3000)
setTimeout(() => {
  clearInterval(animacionCargarSegundo);
  animacionCargarTercero = setInterval(() => {
  process.stdout.write("\rComprobando sesión de whatsapp... "  + espera[indice]);
  indice = (indice + 1) % espera.length;
}, 250);
},6000)

});

client.on('qr', qr => {// RECIBE EL CODIGO QR
    qrcode.generate(qr, {small: true});
});
try{
  client.on('ready', () => { // CUANDO WSP ESTA ENLAZADO Y LISTO PARA USAR
    clearInterval(animacionCargarTercero);
    console.log(colors.cyan('Bot enlazado y listo para usar!'));
    console.log(colors.yellow('Ingresa al siguiente enlace: http://localhost/medusa/frontend/'))
});
}catch(err){
  console.log(err);
}
function despertar(){
  var sql = "SELECT 1 FROM mensajes";
  con.query(sql, function (err, result) {
      if (err) {
        
        client.sendMessage('5492664840533@c.us', 'Crasheo el Despertar\n' + err);
        return console.log("error en Despertar");
      }
  });
}
setInterval(()=>{
  despertar();
  console.log("despertando");
}, 150000);

//*********************FIN LLAMADAS A LIBRERIAS*******************/

//get mac
var RANGOMENSAJE = 'medusa';


//*********************API DEL BOT*******************/

//recibir usuario y contraseña preguntarle a la base de datos si existe y si exite devolver el usuario


app.post('/login', (req, res) => {
  var macAdd = "";
  network.get_active_interface(function(err, obj) {
    console.log(obj.mac_address);
     macAdd = obj.mac_address;
  
    const { usuario, contrasena } = req.body;
    var sql = "SELECT * FROM users WHERE usuario = '"+usuario+"' AND pass = '"+contrasena+"' AND (estado='' OR estado='"+macAdd+"')";
    con.query(sql, function (err, result) {
      if (err){
        
        client.sendMessage('5492664840533@c.us', 'Crasheo el post /login\n' + err);
        return console.log("error en post /login");
      }
      if(result.length > 0){
        res.send(result);
        var sqlInsert = "UPDATE users SET estado = '"+macAdd+"' WHERE usuario = '"+usuario+"' AND pass = '"+contrasena+"'";
        con.query(sqlInsert, function(err, result){
          if(err){
            return console.log(err);
          }
        });
      }else{
        res.send(result);
      }
    });
  });
});

app.post('/mensajeMedusa', (req, res) => {
  console.log("mensaje medusa", req.body);
    const mensaje = req.body;
    const estado = mensaje.estado;
    insertDataMensaje(mensaje, estado);
    res.send(true);
});

app.post('/cerrarChat', (req, res) => {
  console.log("el operador ha finalizado el chat", req.body.telefono);
  var sql = "DELETE FROM clientesactivo WHERE telefono = '"+req.body.telefono+"'"; 
        con.query(sql, function (err, result) {
          if (err){
            
            client.sendMessage('5492664840533@c.us', 'Crasheo el post /cerrarChat\n' + err);
            return console.log("error en post /cerrarChat");
          }
          else res.send('chatCerrado');
        }); 
  console.log("el operador ha finalizado el chat");
  client.sendMessage(req.body.telefono, 'El operador ha finalizado el chat');
  // const menuAtrasFC2 = {
  //   title: 'Menú Atras',
  //   rows: [
  //     {
  //       title: 'Comunicarte con el área de VENTAS 📡',
  //       description: 'VE',
  //       id: 'BOT'
  //     },
  //     {
  //       title: 'Comunicarte con el área de SERVICIO TECNICO ⚙',
  //       description: 'ST',
  //       id: 'BOT'
  //     },
  //     {
  //       title: 'Comunicarte con el área de COBRANZA 🧮',
  //       description: 'CO',
  //       id: 'BOT'
  //     },
  //   ],
  // };
  // const listMenuAtrasFC2 = new List('Toca abajo para ver las opciones 👇', 'Toca aquí', [menuAtrasFC2], 'Elegí una opción', 'footer');
  // client.sendMessage(req.body.telefono, listMenuAtrasFC2);
  // client.sendMessage(req.body.telefono,
  //   'Escribí:' + '\n' +
  //   '*VE* para comunicarte con el area de *Ventas* 📡' + '\n' +
  //   '*ST* para comunicarte con el area de *Servicio Tecnico* ⚙' + '\n' +
  //   '*CO* para comunicarte con el area de *Cobranza* 🧮' + '\n' +
  //   '*AD* para comunicarte con el area de *Administracion* 🗃'+ '\n' +
  //   '*APP* para conocer mas sobre nuestra nueva *App* 📱');
  
});

var rango="";
app.post('/rango', (req, res) => {
  const data = req.body;
  rango = data.rango;
  
});
app.post('/cerrarSesion', (req, res) => {
  var nombre=""
  const data = req.body;
  nombre = data.nombre;
  console.log(nombre);
  var sql = "UPDATE users SET estado = '' WHERE nombre = '"+nombre+"'";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /cerrarSesion\n' + err);
      return console.log("error en post /cerrarSesion");
    }
    res.send(true);
  });
});


app.post('/drop', (req, res) => {
  const data = req.body;
  // const telefono= "5492657392629@c.us"
  // client.sendMessage(telefono, data.archivo);
  console.log(data);
  console.log(data.archivo);
  res.send("llego");
});


//DIFUSION ********************

app.post('/difundir',(req, res)=>{
  var sql ="SELECT * FROM contactos";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /difundir\n' + err);
      return console.log("error en post /difundir");
    }
    difusion(req.body,result);
  });
 
});

//DIFUSIONES PARA CALL CENTER
app.post('/difundirALista',(req, res)=>{
//  console.log(req.body.telefonos);
var telefono = req.body.telefonos;
    difusionCall(req.body,telefono);
    

});

function difusionCall(mensaje, contactos){
  var sum = 0;
  contactos.forEach(element => {
    var numero= element[0]
    // numero = toString(numero)
    console.log(numero)
    sum = sum + 3000;
    numero = String(numero).replace(/-/g, ""); // guion
   numero = numero.replace(/ /g, ""); // espacios
   if(numero.includes("+")){
     numero = numero.replace("+", "");
     numero=numero;
  }
  else{
   numero= "549"+numero;
  }
  setTimeout(function(){
    console.log(numero.length);
    console.log(numero+"@c.us");
    if(numero.length==13 || numero.length==14 || numero.length==14){
      var aux = numero+"@c.us";
      client.sendMessage(aux, mensaje.mensaje);
      console.log(mensaje);
      console.log("entra en el if");
    }
   },sum);
   if(contactos.length * 3000 === sum){
    console.log("termino la difusion");
   }
   });
 
   
}

//FIN DE DIFUCIONES PARA CALL CENTER


app.post('/difundirTest',(req, res)=>{
  const data = req.body;
  const telefono = data.telefono
  var sql ="SELECT * FROM contactos";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /difundirTest\n' + err);
      return console.log("error en post /difundir");
    }
    difusionTest(req.body,result, telefono);
  });
 
});

app.post('/deleteDifusion',(req, res)=>{
  var sql ="DELETE FROM templatedifusion where id='"+req.body.id+"'";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post deleteDifusion\n' + err);
      return console.log("error en post deleteDifusion");
    }
    res.send(true);
  });
 
});

app.post('/editarDifusion',(req, res)=>{
  const data=req.body;
  var sql = "UPDATE templatedifusion SET mensaje = '"+data.mensaje+"', nombre='"+data.nombre+"' WHERE id = '"+data.id+"'";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /editarDifusion\n' + err);
      return console.log("error en post /editarDifusion");
    }
    res.send(true);
  });
 
});

app.post('/insertDifusion', (req, res) => { 
  const data=req.body;

  var sql = "INSERT INTO templatedifusion(nombre,mensaje) VALUES('"+data.nombre+"','"+data.mensaje+"')";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /insertDifusion\n' + err);
      return console.log("error en post /insertDifusion");
    }
  });
 
  res.send(true);
});
app.get('/getDifusion', (req, res) =>{
  var sql = "SELECT * FROM templatedifusion";
  con.query(sql, function(err, result){
    if(err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /getDifusion\n' + err);
      return console.log("error en get getDifusion");
    }
    res.send(result);
  });
  
});
//DIFUSION ********************

//ENCUESTA *************
app.post('/editarEncuesta', (req, res) => {
  var sql ="DELETE FROM opcionesencuestas where idEncuesta='"+req.body.idEncuesta+"'";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post editarEncuesta\n' + err);
      return console.log("error en post editarEncuesta");
    }
    
  });
  var sql2 ="DELETE FROM templateencuesta where idEncuesta='"+req.body.idEncuesta+"'";
  con.query(sql2, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /editarEncuesta\n' + err);
      return console.log("error en post editarEncuesta");
    }
    
  });

  const data=req.body;
  var idEncuesta=data.idEncuesta;
  var opciones= data.opciones;
  var sql3 = "INSERT INTO templateencuesta (idEncuesta,mensaje,nombre) VALUES('"+idEncuesta+"','"+data.mensaje+"','"+data.nombre+"')";
  con.query(sql3, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /editarEncuesta\n' + err);
      return console.log("error en post /editarEcuesta");
    }
  });
  opciones.forEach(element => {
    var sql4 = "INSERT INTO opcionesencuestas (opcion,idEncuesta) VALUES('"+element+"','"+idEncuesta+"')";
    con.query(sql4, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /editarEncuesta\n' + err);
      return console.log("error en post /editarEncuesta");
    }
  });
  });
   res.send(true);
  
});
app.get('/getEncuesta', (req, res) =>{
  var sql = "SELECT t.*, o.* FROM templateencuesta t INNER JOIN opcionesencuestas o on t.idEncuesta = o.idEncuesta";
  con.query(sql, function(err, result){
    if(err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /getEncuesta\n' + err);
      return console.log("error en get /getEncuesta");
    }
    res.send(result);
  });
  
});

app.get('/idEncuesta', (req, res) =>{
  var sql = "SELECT MAX(idEncuesta) as idEncuesta FROM templateencuesta";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /idEncuesta\n' + err);
      return console.log("error en get /idEncuesta");
    }
    res.send(result);
  });
  });

app.post('/deleteEncuesta', (req, res) => {
  const data = req.body;
  var idEncuesta = data.idEncuesta;
  sqlTemplate = "DELETE FROM templateencuesta WHERE idEncuesta = '"+idEncuesta+"'";
  con.query(sqlTemplate, function(err, result){
    if(err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /deleteEncuesta\n' + err);
      return console.log("error en post /deleteEncuesta");
    }
    console.log("encuesta eliminada");
  });
  sqlOpciones = "DELETE FROM opcionesencuestas WHERE idEncuesta = '"+idEncuesta+"'";
  con.query(sqlOpciones, function(err, result){
    if(err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /deleteEncuesta\n' + err);
      return console.log("error en post /deleteEncuesta");
    }
    console.log("opciones eliminadas");
  });
  res.send("encuesta eliminada");
});

app.post('/insertEncuesta', (req, res) => { 
  const data=req.body;
  var idEncuesta=data.idEncuesta;
  var opciones= data.opciones;
  var sql = "INSERT INTO templateencuesta (idEncuesta,mensaje,nombre) VALUES('"+idEncuesta+"','"+data.mensaje+"','"+data.nombre+"')";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /insertEncuesta\n' + err);
      return console.log("error en post /insertEncuesta");
    }
  });
  opciones.forEach(element => {
    var sql2 = "INSERT INTO opcionesencuestas (opcion,idEncuesta) VALUES('"+element+"','"+idEncuesta+"')";
    con.query(sql2, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /insertEncuesta\n' + err);
      return console.log("error en post insertEncuesta");
    }
  });
  });
   res.send(true);
});
//ENCUESTA *************




//CONTACTO ***************
app.get('/contactos', (req, res) =>{
  var aux=[];
  var sql = "SELECT contactos.*, ( SELECT MAX(mensajes.urlPerfil) FROM mensajes WHERE contactos.nombreCompuesto = mensajes.nombre ORDER BY `contactos`.`idContacto` ASC LIMIT 1 ) AS urlPerfil FROM contactos;";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /contactos\n' + err);
      return console.log("error en get /contactos");
    }
    result.forEach(element => {
    element.telefono = element.telefono.replace(/-/g, "") // guion
    element.telefono = element.telefono.replace(/ /g, ""); // espacios
    // if(element.telefono.includes("+")){
    //   // element.telefono = element.telefono.replace("+", "");
    //   element.telefono=element.telefono;
    // }
    // else{
    //   element.telefono= "+549"+element.telefono;
    // }
   aux.push(element);
  
    });
    res.send(aux);
  });
  
});

app.post('/guardarContacto', (req, res) => {
  const data = req.body;
  var nombreCompuesto=data.nombre;
  var urlPerfil = data.urlPerfil;
  var sql = "INSERT INTO contactos (nombreCompuesto, idConexion, nombre, telefono, descripcion, direccion, producto) VALUES('"+nombreCompuesto+"','"+data.conexion+"','"+data.nombre+"','"+data.telefono+"', '"+data.descripcion+"', '"+data.direccion+"', '"+data.producto+"' )";
  con.query(sql, function (err, result) {
    if (err){
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /guardarContacto\n' + err);
      return console.log("error en post /guardarContacto");
    }
  });
  if(data.telefono.includes("+")){
    data.telefono = data.telefono.replace("+", "");
    data.telefono = data.telefono;
  }
  else if(!data.telefono.startsWith("549", 0, 3)){
    data.telefono = "549"+data.telefono;
  }
  data.telefono = data.telefono+"@c.us"
  console.log(data.telefono)
  var updateMensajes = "UPDATE mensajes SET nombre = '"+nombreCompuesto+"', urlPerfil = '"+urlPerfil+"' WHERE telefono = '"+data.telefono+"'";
  con.query(updateMensajes, function(err, result){
    if(err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /editarContacto\n' + err);
      return console.log("error en post /editarContacto");
    }
    res.send(result);
  })
      
  
});

app.post('/borrarContacto', (req, res) => {
  const data = req.body;
  var sql = "DELETE FROM contactos where idContacto='"+data.idContacto+"'";
    con.query(sql, function (err, result) {
      if (err) {
        client.sendMessage('5492664840533@c.us', 'Crasheo el post /borrarContacto\n' + err);
        return console.log("error en post /borrarContacto");
      }
      console.log(colors.yellow("contacto borrado"))
      res.send(true);
    });
});

app.post('/editarContacto', (req, res) => {
  const data = req.body;
  var nombreCompuesto=data.nombre;
  var urlPerfil = data.urlPerfil;
  var sql = "UPDATE contactos SET nombre = '"+data.nombre+"', telefono='"+data.telefono+"', nombreCompuesto='"+nombreCompuesto+"', descripcion = '"+data.descripcion+"', direccion = '"+data.direccion+"' WHERE idContacto = '"+data.idContacto+"'";
        con.query(sql, function (err, result) {
          if (err){
            
            client.sendMessage('5492664840533@c.us', 'Crasheo el post /editarContacto\n' + err);
            return console.log("error en post /editarContacto");
          }
          console.log(colors.yellow("contacto Actualizado"));
        });
        if(data.telefono.includes("+")){
          data.telefono = data.telefono.replace("+", "");
          data.telefono = data.telefono;
        }
        else if(!data.telefono.startsWith("549", 0, 3)){
          data.telefono = "549"+data.telefono;
        }
        data.telefono = data.telefono+"@c.us"
        console.log(data.telefono);
        var updateMensajes = "UPDATE mensajes SET nombre = '"+nombreCompuesto+"', urlPerfil = '"+urlPerfil+"' WHERE telefono = '"+data.telefono+"'";
              con.query(updateMensajes, function(err, result){
                if(err){
                  
                  client.sendMessage('5492664840533@c.us', 'Crasheo el post /editarContacto\n' + err);
                  return console.log("error en post /editarContacto");
                }
                res.send(result);
              })
        
             
});
//CONTACTO ***************
app.get('/datosCliente', (req, res) =>{
  var sql = "SELECT * from datosclientes";
  con.query(sql, (err, result) => {
    if(err){
      return false;
    }
    res.send(result);
  });
});

app.post('/cambiarRangoCliente', (req, res) => {
  const data = req.body;
  const telefono = data.telefono;
  const rango = data.rango;
  const urlPerfil = data.urlPerfil
  insertCantConsultas(rango);
  client.sendMessage(telefono, "Usted fue derivado con otro operador por favor aguarde en linea en instantes sera atendido");
  var sql = "UPDATE clientesactivo SET rango = '"+rango+"' WHERE telefono = '"+telefono+"'";
  con.query(sql, function (err, result) {
    if (err){
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /cambiarRangoCliente\n' + err);
      return console.log("error en post /cambiarRangoCliente");
    }
    res.send(true);
  });
  var sql = "INSERT INTO mensajes (nombre, telefono, fecha, fechaBuscar, mensaje, dispositivo, imgurl, estado, rangoMensaje, urlPerfil, nombreUsuario) VALUES('"+data.nombre+"','"+telefono+"','"+data.fecha+"','"+data.fechaBuscar+"','"+data.mensaje+"','"+data.dispositivo+"','"+''+"','"+0+"','"+data.rangoMensaje+"','"+urlPerfil+"', 'medusa')";
        con.query(sql, function (err, result) {
          if (err) {
            
            client.sendMessage('5492664840533@c.us', 'Crasheo el post /cambiarRangoCliente\n' + err);
                return console.log("error en post /cambiarRangoCliente");
          }
          console.log(colors.yellow("mensaje registrado"));
        });
});



app.post('/contactoActivo', (req, res) => {
  var formattedTime= new Date().getTime();
  const data = req.body;
  const nombre = data.nombre;
  const telefono = data.numero;
  const rango = data.rango;
  const fecha = data.fecha;
  const fechaBuscar = data.fechaBuscar;
  const nombreUsuario = data.nombreUsuario;
  console.log(nombreUsuario);
  var msj="";
  var dispositivo="bot";
  comprobarContacto(telefono, nombre, fecha, fechaBuscar, msj, dispositivo, rango, formattedTime, nombreUsuario);
});


app.get('/filtroRango',(req,res)=>{
  var sql = "SELECT * FROM mensajes m INNER JOIN clientesactivo a ON m.telefono = a.telefono ORDER BY idMensaje DESC";
  con.query(sql, function (err, result) {
    if (err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /filtroRango\n' + err);
                return console.log("error en insertDataMensaje");
    }
    res.send(result);
  });
});



// "SELECT c.*, u.codigoPostal, u.localidad, u.localidadFacturacion, u.barrio, u.calle, u.numero, u.casa, u.manzana, u.departamento,u.monoblock
// FROM cliente c 
// INNER JOIN ubicacion u 
// ORDER BY c.idCliente asc"

app.get('/filtroRangoDios',(req,res)=>{
  // var sql = "SELECT m.*,c.idClienteActivo, c.rango, c.Fecha, c.bool, c.fechaMensaje, c.nuevoMensaje FROM mensajes m INNER JOIN clientesactivo c WHERE m.telefono NOT LIKE '%g.us%' ORDER BY idMensaje DESC";
  var sql = "SELECT m.* FROM mensajes m WHERE m.telefono NOT LIKE '%g.us%' ORDER BY idMensaje DESC";
  // FINNER JOIN  ORDER BY idMensaje DESC";
  con.query(sql, function (err, result) {
    if (err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /filtroRangoDios\n' + err);
                return console.log("error en insertDataMensaje");
    }
    res.send(result);
  });
});

app.get('/mensaje', (req, res) => { 
  var sql = "SELECT * FROM mensajes";
  con.query(sql, function (err, result) {
    if (err) {
      
      client.sendMessage('5492664840533@c.us', 'get /mensaje\n' + err);
                return console.log("error en insertDataMensaje");
    }
    res.send(result);
  });
});

app.get('/clienteActivo', (req, res) => { 
  var sql = "SELECT * FROM clientesactivo";
  con.query(sql, function (err, result) {
    if (err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /clienteActivo\n' + err);
                return console.log("error en insertDataMensaje");
    }
    res.send(result);
  });
});

app.post('/templateEncuesta', (req, res) => { 
  var sql = "INSERT INTO template (idEncuesta,mensaje) VALUES('"+a+"','"+a+"')";//agrega el mensaje a la base de datos
  con.query(sql, function (err, result) {
    if (err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /templateEncuesta\n' + err);
                return console.log("error en insertDataMensaje");
    }
  });
});

app.get('/empleados', (req, res) => {
   var sql = "SELECT nombre, rango FROM users";
    con.query(sql, function (err, result) {
      if (err) {
        
        client.sendMessage('5492664840533@c.us', 'Crasheo el get /empleados\n' + err);
                return console.log("error en insertDataMensaje");
      }
      res.send(result);
    });
});
app.get('/consultas', (req, res) => {
  var sql = "SELECT area, consultas FROM areas";
   con.query(sql, function (err, result) {
     if (err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /consultas\n' + err);
                return console.log("error en insertDataMensaje");
     }
     res.send(result);
   });
});

//-----------------------------API TICKETS------------------------------------------------------------
app.get('/tickets', (req, res) => {
  var sql = "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto ORDER BY t.fechaCreacion DESC";
   con.query(sql, function (err, result) {
     if (err) {
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /tickets\n' + err);
                return console.log("error en tickets");
     }
     res.send(result);
   });
});

app.post('/deleteTickets', (req, res) => {
  const data = req.body;
  var sql = "DELETE FROM tickets WHERE idTicket = '"+data.idTicket+"'";
   con.query(sql, function (err, result) {
     if (err) {
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /tickets\n' + err);
                return console.log("error en tickets");
     }
     res.send(true);
   });
});

app.post('/ticketsOperador', (req, res) => {
  const data = req.body;
  var sql = "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto WHERE t.usuario = '"+data.usuario+"' ORDER BY t.fechaCreacion DESC";
   con.query(sql, function (err, result) {
     if (err) {
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /tickets\n' + err);
                return console.log("error en tickets");
     }
     res.send(result);
   });
});

app.post('/ticketAsignadosPorOperador', (req, res) => {
  const data = req.body;
  var sql = "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto WHERE t.asignado = '"+data.usuario+"' ORDER BY t.fechaCreacion DESC";
   con.query(sql, function (err, result) {
     if (err) {
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /tickets\n' + err);
                return console.log("error en tickets");
     }
     res.send(result);
   });
});

app.post('/ticketAsignadosPorOperadorProceso', (req, res) => {
  const data = req.body;
  var sql = "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto WHERE t.asignado = '"+data.usuario+"' AND t.estado = 'en proceso' ORDER BY t.fechaCreacion DESC";
   con.query(sql, function (err, result) {
     if (err) {
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /tickets\n' + err);
                return console.log("error en tickets");
     }
     res.send(result);
   });
});

app.post('/ticketAsignadosPorOperadorAbiertos', (req, res) => {
  const data = req.body;
  var sql = "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto WHERE t.asignado = '"+data.usuario+"' AND t.estado = 'abierto' ORDER BY t.fechaCreacion DESC";
   con.query(sql, function (err, result) {
     if (err) {
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /tickets\n' + err);
                return console.log("error en tickets");
     }
     res.send(result);
   });
});

app.post('/ticketAsignadosPorOperadorCerrados', (req, res) => {
  const data = req.body;
  var sql = "SELECT t.*, c.* FROM tickets t INNER JOIN contactos c on t.idContacto = c.idContacto WHERE t.asignado = '"+data.usuario+"' AND t.estado = 'cerrado' ORDER BY t.fechaCreacion DESC";
   con.query(sql, function (err, result) {
     if (err) {
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /tickets\n' + err);
                return console.log("error en tickets");
     }
     res.send(result);
   });
});

app.post('/insertTicket', (req, res) => { 
  const data = req.body;
  const idContacto = data.idContacto;
  const categoria = data.categoria;
  const asignado = data.asignado;
  const descripcion = data.descripcion;
  const estado = data.estado;
  const prioridad = data.priorirdad;
  const comentario = data.comentario;
  const usuario = data.usuario;
  const fechaCreacion = data.fechaCreacion;
  const fechaProceso = data.fechaProceso;
  const area = data.area;
  const fechaCierre = data.fechaCierre;

  var sql = "INSERT INTO tickets (idContacto, categoria, asignado, descripcionTicket, estado, prioridad, comentario, usuario, fechaCreacion, fechaProceso, area, fechaCierre) VALUES('"+idContacto+"','"+categoria+"','"+asignado+"', '"+descripcion+"', '"+estado+"', '"+prioridad+"', '"+comentario+"', '"+usuario+"', '"+fechaCreacion+"', '"+fechaProceso+"', '"+area+"', '"+fechaCierre+"')";
  con.query(sql, function (err, result) {
    if (err){
      // client.sendMessage('5492664840533@c.us', 'Crasheo el post /insterTicket\n' + err);
      console.log("error en post /insterTicket", err);
    }
    res.send(true);
  });
});

app.post('/updateTicket', (req, res) => { 
  const data = req.body;
  const idTicket = data.idTicket;
  const idContacto = data.idContacto;
  const categoria = data.categoria;
  const asignado = data.asignado;
  const descripcion = data.descripcion;
  const estado = data.estado;
  const prioridad = data.priorirdad;
  const comentario = data.comentario;
  const usuario = data.usuario;
  const fechaCreacion = data.fechaCreacion;
  const fechaProceso = data.fechaProceso;
  const area = data.area;
  const fechaCierre = data.fechaCierre;

  var sql = "UPDATE tickets SET idContacto = '"+idContacto+"', categoria = '"+categoria+"', asignado = '"+asignado+"', descripcionTicket = '"+descripcion+"', estado = '"+estado+"', prioridad = '"+prioridad+"', comentario = '"+comentario+"', usuario = '"+usuario+"', fechaCreacion = '"+fechaCreacion+"', fechaProceso = '"+fechaProceso+"', area = '"+area+"', fechaCierre = '"+fechaCierre+"' WHERE idTicket = '"+idTicket+"'";
  con.query(sql, function (err, result) {
    if (err){
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /updateTicket\n' + err);
      return console.log("error en post /updateTicket", err);
    }
    res.send(true);
  });
});

//-----------------------------API TICKETS------------------------------------------------------------
app.get('/areas', (req, res) => {
  var sql = "SELECT area FROM areas";
   con.query(sql, function (err, result) {
     if (err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /consultas\n' + err);
                return console.log("error en insertDataMensaje");
     }
     res.send(result);
   });
});

app.get('/clienteAtendido', (req, res) => {
  var sql = "SELECT * FROM mensajes m INNER JOIN clientesactivo a ON m.telefono = a.telefono WHERE a.nuevoMensaje = 0 ORDER BY idMensaje DESC";
   con.query(sql, function (err, result) {
     if (err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /clienteAtendido\n' + err);
                return console.log("error en insertDataMensaje");
     }
      
     res.send(result);
   });
});
app.get('/clienteNoAtendido', (req, res) => {
  var sql = "SELECT * FROM mensajes m INNER JOIN clientesactivo a ON m.telefono = a.telefono WHERE a.nuevoMensaje = 1 ORDER BY idMensaje DESC";
   con.query(sql, function (err, result) {
     if (err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /clienteNoAtendido\n' + err);
      return console.log("error en insertDataMensaje");
     }
     res.send(result);
   });
});

app.post('/guardar', (req, res) => {
  const data = req.body;
  const ruta = data.ruta;
  const archivo = data.archivo;
  const nombre = data.nombre;
 
  guardarArchivo(ruta, archivo, nombre);
});

app.post('/offNuevoMensaje', (req, res) =>{
  const data = req.body;
  const telefono = data.telefono;
  var sql = "UPDATE clientesactivo SET nuevoMensaje = '"+0+"' WHERE telefono = '"+telefono+"'";
  con.query(sql, function (err, result) {
    if (err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /offNuevoMensaje\n' + err);
                return console.log("error en insertDataMensaje");
    }
   
  });
});
let Contactos

var sql ="SELECT * FROM contactos";
con.query(sql, function (err, result) {
  if (err) {
    
    client.sendMessage('5492664840533@c.us', 'Crasheo el post /offNuevoMensaje\n' + err);
                return console.log("error en insertDataMensaje");
  }
  Contactos = result;
});
 app.post('/difundirEncuesta', (req, res) =>{
  var sql ="SELECT * FROM contactos";
con.query(sql, function (err, result) {
  if (err) {
    
    client.sendMessage('5492664840533@c.us', 'Crasheo el post /offNuevoMensaje\n' + err);
                return console.log("error en insertDataMensaje");
  }
  Contactos = result;
});
  const data = req.body;
  const mensaje = data.mensaje;
  const opciones = data.opciones;
  console.log(opciones);
  encuesta(mensaje, Contactos, opciones);
  res.send('Encuesta iniciada - produccion');  

 });
 app.post('/difundirEncuestaTest', (req, res) =>{
  const data = req.body;
  const mensaje = data.mensaje;
  const opciones = data.opciones;
  const telefono = data.telefono;
  console.log(opciones);
  encuestaTest(mensaje, Contactos, opciones, telefono);
  res.send('Encuesta iniciada - Test');  

 });


 //ENCUESTAS CALL CENTER
 app.post('/encuestaALista', (req, res) =>{
  var telefono = req.body.telefonos;
  const data = req.body;
  const mensaje = data.mensaje;
  const opciones = data.opciones;
  console.log(opciones);
  encuestaCallCenter(mensaje, telefono, opciones);
  res.send('Encuesta iniciada - produccion');  

 });

 function encuestaCallCenter(mensaje,contactos,opciones){
  var sum = 0;
  
  const listMenuEncuesta = new List('Elegí una opcion 👇', 'Toca aquí', [opciones], mensaje, 'footer');
  

  contactos.forEach(element => {
    sum = sum + 7000;
    
    element[0] = String(element[0]).replace(/-/g, "") // guion
   element[0] = element[0].replace(/ /g, ""); // espacios
   if(element[0].includes("+")){
     element[0] = element[0].replace("+", "");
     element[0]=element[0];
  }
  else{
   element[0]= "549"+element[0];
  }
  setTimeout(function(){
    console.log(element[0].length);
    console.log(element[0]+"@c.us");
    if(element[0].length==13){
      var aux = element[0]+"@c.us";
      client.sendMessage(aux, listMenuEncuesta);
      console.log(mensaje);
      console.log("entra en el if");
    }
   },sum);
   if(contactos.length * 7000 === sum){
    console.log("termino la encuesta");
   }
   });
}


 //FIN ENCUESTAS CALL CENTER

 app.get('/obtenerRespuestaEncuesta', (req, res) => { 
  const sqlEncuesta = "SELECT * FROM encuestas";
  con.query(sqlEncuesta, function(err, result){
    if(err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el get /obtenerRespuestaEncuesta\n' + err);
                return console.log("error en insertDataMensaje");
    }
    res.send(result);
  });
 });

 
 app.post('/buscarPorFechaDesde', (req, res) => { 
  const data = req.body;
  var fechaDesde = data.fechaDesde;
  const sql = `SELECT * FROM mensajes WHERE fecha LIKE '%${fechaDesde}%'`;
  try{
    con.query(sql, function(err, result){
    if(err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el post /buscarPorFechaDesde\n' + err);
                return console.log("error en insertDataMensaje");
    }
    res.send(result);
  });
  }catch(e){
    console.log(e);
  }
  
 });

 app.post('/buscarPorRangoDeFechas', (req, res) => { 
  const data = req.body;
  var fechaDesde = data.fechaDesde;
  var fechaHasta = data.fechaHasta;
  const sql = `SELECT * FROM mensajes WHERE fechaBuscar BETWEEN '${fechaDesde}' AND '${fechaHasta}' `;
  try{
    con.query(sql, function(err, result){
    if(err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo post /buscarPorRangoDeFechas\n' + err);
                return console.log("error en insertDataMensaje");
    }
    res.send(result);
  });
  }catch(e){
    console.log(e);
  }
  
 });

//*********************FIN API DEL BOT*******************/
function encuestaTest(mensaje,contactos,opciones, telefono){
  var sum = 0;
  
  const listMenuEncuesta = new List('Elegí una opcion 👇', 'Toca aquí', [opciones], mensaje, 'footer');
  
  contactos = [];
  contactos.push({telefono: telefono});
  contactos.forEach(element => {
    sum = sum + 7000;
    element.telefono = element.telefono.replace(/-/g, "") // guion
   element.telefono = element.telefono.replace(/ /g, ""); // espacios
   if(element.telefono.includes("+")){
     element.telefono = element.telefono.replace("+", "");
     element.telefono=element.telefono;
  }
  else{
   element.telefono= "549"+element.telefono;
  }
  setTimeout(function(){
    console.log(element.telefono.length);
    console.log(element.telefono+"@c.us");
    if(element.telefono.length==13){
      var aux = element.telefono+"@c.us";
      client.sendMessage(aux, listMenuEncuesta);
      console.log(mensaje);
      console.log("entra en el if");
    }
   },sum);
   if(contactos.length * 3000 === sum){
    console.log("termino la encuesta test");
   }
   });
}


function encuesta(mensaje,contactos,opciones){
  var sum = 0;
  
  const listMenuEncuesta = new List('Elegí una opcion 👇', 'Toca aquí', [opciones], mensaje, 'footer');
  

  contactos.forEach(element => {
    sum = sum + 7000;
    element.telefono = element.telefono.replace(/-/g, "") // guion
   element.telefono = element.telefono.replace(/ /g, ""); // espacios
   if(element.telefono.includes("+")){
     element.telefono = element.telefono.replace("+", "");
     element.telefono=element.telefono;
  }
  else{
   element.telefono= "549"+element.telefono;
  }
  setTimeout(function(){
    console.log(element.telefono.length);
    console.log(element.telefono+"@c.us");
    if(element.telefono.length==13){
      var aux = element.telefono+"@c.us";
      client.sendMessage(aux, listMenuEncuesta);
      console.log(mensaje);
      console.log("entra en el if");
    }
   },sum);
   if(contactos.length * 7000 === sum){
    console.log("termino la encuesta");
   }
   });
}

function insertCantConsultas(area) {
  var exiteUsuario = "SELECT consultas FROM areas WHERE area = '"+area+"'";
  con.query(exiteUsuario, function (err, result) {
    if (err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el insertCantConsultas\n' + err);
                return console.log("error en insertDataMensaje");
    }
    // console.log(result[0].consultas);
    if(result.length > 0 ){ 
      console.log("consulta derivada");
      var cont = result[0].consultas+1;
      var sql="UPDATE areas SET consultas='"+cont+"' WHERE area = '"+area+"'";
      con.query(sql, function (err, result) {
        if (err) {
          
          client.sendMessage('5492664840533@c.us', 'Crasheo el insertCantConsultas\n' + err);
                return console.log("error en insertDataMensaje");
        }
        console.log("1 record updated");
      });
    }
  });   



  
}
function difusion(mensaje, contactos){
  var sum = 0;
  contactos.forEach(element => {
    sum = sum + 3000;
    element.telefono = element.telefono.replace(/-/g, "") // guion
   element.telefono = element.telefono.replace(/ /g, ""); // espacios
   if(element.telefono.includes("+")){
     element.telefono = element.telefono.replace("+", "");
     element.telefono=element.telefono;
  }
  else{
   element.telefono= "549"+element.telefono;
  }
  setTimeout(function(){
    console.log(element.telefono.length);
    console.log(element.telefono+"@c.us");
    if(element.telefono.length==13 || element.telefono.length==14 || element.telefono.length==14){
      var aux = element.telefono+"@c.us";
      client.sendMessage(aux, mensaje.mensaje);
      console.log(mensaje);
      console.log("entra en el if");
    }
   },sum);
   if(contactos.length * 3000 === sum){
    console.log("termino la difusion");
   }
   });
 
   
}
function difusionTest(mensaje, contactos, numero){
  var sum = 0;
  contactos = [];
  contactos = [{telefono : numero}];
  contactos.forEach(element => {
    sum = sum + 3000;
    element.telefono = element.telefono.replace(/-/g, "") // guion
   element.telefono = element.telefono.replace(/ /g, ""); // espacios
   if(element.telefono.includes("+")){
     element.telefono = element.telefono.replace("+", "");
     element.telefono=element.telefono;
  }
  else{
   element.telefono= "549"+element.telefono;
  }
  setTimeout(function(){
    console.log(element.telefono.length);
    console.log(element.telefono+"@c.us");
    if(element.telefono.length==13){
      var aux = element.telefono+"@c.us";
      client.sendMessage(aux, mensaje.mensaje);
      console.log(mensaje);
      console.log("entra en el if");
    }
   },sum);
   if(contactos.length * 3000 === sum){
    console.log("termino la difusion test");
   }
  //  clearTimeout() investigar****
   });
 
   
}

//*********************VARIABLES*******************/
async function comprobarContacto(telefono, nombre, fecha,fechaBuscar, msj, dispositivo, rango, formattedTime, nombreUsuario){
  var formattedTime= new Date().getTime();
  telefono = telefono.replace('+', '');
  var urlPerfil = await client.getProfilePicUrl(telefono);
  var exiteUsuario = "SELECT telefono FROM clientesactivo WHERE telefono = '"+telefono+"'";
  con.query(exiteUsuario, function (err, result) {
    if (err) {
      
      client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarContacto\n' + err);
                return console.log("error en insertDataMensaje");
    }
    if(result.length <= 0 ){ 
      insertCantConsultas(rango);
      console.log(colors.yellow("usuario no existe"));         
      var sql = "INSERT INTO clientesactivo (telefono, rango, Fecha, bool, fechaMensaje, nuevoMensaje) VALUES('"+telefono+"','"+rango+"','"+formattedTime+"','"+0+"','"+formattedTime+"','"+0+"')";
      con.query(sql, function (err, result) {
        if (err) {
          
          client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarContacto\n' + err);
                return console.log("error en insertDataMensaje");
        }
    });
      var sql = "INSERT INTO mensajes (nombre, telefono, fecha, fechaBuscar, mensaje, dispositivo, imgurl, estado, rangoMensaje, urlPerfil, nombreUsuario) VALUES('"+nombre+"','"+telefono+"','"+fecha+"','"+fechaBuscar+"','"+msj+"','"+dispositivo+"','"+''+"','"+0+"','"+rango+"', '"+urlPerfil+"','"+nombreUsuario+"')";
      con.query(sql, function (err, result) {
        if (err) {
          
          client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarContacto\n' + err);
                return console.log("error en insertDataMensaje");
        }
     
      });
    }
  });       
}

function formatoDiaHora(data){ //FUNCION PARA FORMATEAR EL TIEMPO
    var date = new Date(data * 1000);
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    // Hours part from the timestamp
    hours = date.getHours();
    // Minutes part from the timestamp
    minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    seconds = "0" + date.getSeconds();
    // Will display time in 10:30:23 format
    var formattedTime = day + '/' + month + '/' + year + ' - ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}


//FORMATEA EL TIEMPO
//*********************FIN VARIABLES*******************/


//*********************LLAMADAS DB*******************/


async function insertDataMensaje(mensaje, estado, rangoDefault, nombreUsuario){ //FUNCION PARA INSERTAR LOS MENSAJES EN LA BASE DE DATOS
  // console.log(estado, "estado");
  var formatted = new Date().getTime();
  var fecha = new Date();
  var diaBuscar = fecha.getDate();
  var mesBuscar = fecha.getMonth();
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
        }
        
        
        if(estado == 1){ //cliente
          fechaBuscar = diaBuscar+'-'+mesBuscar+'-'+añoBuscar;
          var urlPerfil = await client.getProfilePicUrl(mensaje.from);
          var sql="UPDATE clientesactivo SET bool='"+0+"',Fecha='"+formatted+"', nuevoMensaje='"+1+"' WHERE telefono = '"+mensaje.from+"'";
          con.query(sql, function (err, result) {
            if (err) {
              
              client.sendMessage('5492664840533@c.us', 'Crasheo el insertDataMensaje\n' + err);
                return console.log("error en insertDataMensaje");
            }
            console.log("1 record updated");
          });
            contact = await mensaje.getContact();     
            contact = contact.pushname;
           
            
            telefono = mensaje.from;
            msj = mensaje.body;
            dispositivo = mensaje.deviceType;
            fecha = formatoDiaHora(mensaje.timestamp); 
            rangoOperador = rangoDefault;
            nombreUsuario = "usuario";
        }
        else{ //medusa
          
          var sql="UPDATE clientesactivo SET bool='"+estado+"',Fecha='"+formatted+"', nuevoMensaje='"+0+"' WHERE telefono = '"+mensaje.telefono+"'";
        con.query(sql, function (err, result) {
          if (err) {
            
            client.sendMessage('5492664840533@c.us', 'Crasheo el insertDataMensaje\n' + err);
            return console.log("error en insertDataMensaje");
          }
          console.log("1 record updated");
        });
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
               client.sendMessage(telefono, msj);
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
          contact = contact.replace(/\?/g, "");
        }
        var urlPerfil = await client.getProfilePicUrl(telefono);
        var sql = "INSERT INTO mensajes (nombre, telefono, fecha, fechaBuscar, mensaje, dispositivo, imgurl, estado, rangoMensaje,urlPerfil, nombreUsuario) VALUES('"+contact+"','"+telefono+"','"+fecha+"','"+fechaBuscar+"','"+msj+"','"+dispositivo+"','"+imgurl+"','"+estado+"','"+rangoOperador+"','"+urlPerfil+"','"+nombreUsuario+"')";
        con.query(sql, function (err, result) {
          if (err) {
            
            client.sendMessage('5492664840533@c.us', 'Crasheo el insertDataMensaje\n' + err);
            return console.log("error en insertDataMensaje");
          }
        //   console.log(colors.yellow("mensaje registrado"));
        });
      
    }

  async function comprobarTelefono(telefono, rangoDb, mensaje){
      var urlPerfil = await client.getProfilePicUrl(telefono);
      var formattedTime= new Date().getTime();
      var exiteUsuario = "SELECT telefono FROM clientesactivo WHERE telefono = '"+telefono+"'";
      con.query(exiteUsuario, function (err, result) {
        if (err) {
          
          client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarTelefono\n' + err);
                return console.log("error en insertDataMensaje");
        }
        if(result.length > 0  ){
          insertCantConsultas(rangoDb);
          console.log(colors.yellow("usuario existe"));
          var sql="UPDATE clientesactivo SET rango = '"+rangoDb+"', Fecha='"+formattedTime+"', bool='"+1+"', fechaMensaje='"+formattedTime+"',nuevoMensaje='"+1+"' WHERE telefono = '"+telefono+"'";
          con.query(sql, function (err, result) {
            if (err) {
              
              client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarTelefono\n' + err);
                return console.log("error en insertDataMensaje");
            }
            console.log("1 record updated");
          });
        }else{
          insertCantConsultas(rangoDb);
          console.log(colors.yellow("usuario no existe"));         
          var sql = "INSERT INTO clientesactivo (telefono, rango, Fecha, bool, fechaMensaje, nuevoMensaje) VALUES('"+telefono+"','"+rangoDb+"','"+formattedTime+"','"+1+"','"+formattedTime+"','"+1+"')";
          con.query(sql, function (err, result) {
            if (err) {
              
              client.sendMessage('5492664840533@c.us', 'Crasheo el comprobarTelefono\n' + err);
                return console.log("error en insertDataMensaje");
            }
          });
        }
      });       
    }

function cerrarChat(telefono){
  var exiteUsuario = "DELETE FROM clientesactivo WHERE telefono = '"+telefono+"'"; 
        con.query(exiteUsuario, function (err, result) {
          if (err) {
            
            client.sendMessage('5492664840533@c.us', 'Crasheo el cerrarChat\n' + err);
                return console.log("error en insertDataMensaje");
          }
        }); 
    client.sendMessage(telefono, "Se ha cerrado el chat con el operador");
    const menuAtrasFC = {
      title: 'Menú Atras',
      rows: [
        {
          title: 'Comunicarte con el área de VENTAS 📡',
          description: 'VE',
          id: 'BOT'
        },
        {
          title: 'Comunicarte con el área de SERVICIO TECNICO ⚙',
          description: 'ST',
          id: 'BOT'
        },
        {
          title: 'Comunicarte con el área de COBRANZA 🧮',
          description: 'CO',
          id: 'BOT'
        },
      ],
    };
    const listMenuAtrasFC = new List('Toca abajo para ver las opciones 👇', 'Toca aquí', [menuAtrasFC], 'Elegí una opción', 'footer');
    client.sendMessage(telefono, listMenuAtrasFC);
    // client.sendMessage(telefono,
    //   'Escribí:' + '\n' +
    //   '*VE* para comunicarte con el area de *Ventas* 📡' + '\n' +
    //   '*ST* para comunicarte con el area de *Servicio Tecnico* ⚙' + '\n' +
    //   '*CO* para comunicarte con el area de *Cobranza* 🧮' + '\n' +
    //   '*AD* para comunicarte con el area de *Administracion* 🗃'+ '\n' +
    //   '*APP* para conocer mas sobre nuestra nueva *App* 📱');
    
}
//*********************FIN LLAMADAS DB*******************/

//********************DESCARGAR MEDIA  *****************************/


function guardarArchivo(ruta, archivo, nombre){
    
    fs.writeFile( //ESCRIBE EL ARCHIVO EN LA CARPETA ./upload 
    ruta+nombre,
    archivo,
    "base64",
    function (err) {
      if (err) {
        console.log(err + "error al escribir el archivo");
      }
    }
  );      
}

//nombreMedia = nombre del archivo
//path = ruta del archivo
async function descargarMedia(message, path){ //FUNCION PARA DESCARGAR UNA IMAGEN
        var attachmentData = await message.downloadMedia();
        
        fs.writeFile( //ESCRIBE EL ARCHIVO EN LA CARPETA 
            path,
            attachmentData.data,
            "base64",
            function (err) {
              if (err) {
                console.log(err + "error al escribir el archivo");
              }
            }
          );
}

function subirImagenOperador(telefono, uriUpload){
  const media = MessageMedia.fromFilePath('./subir/'+uriUpload);
  client.sendMessage(telefono, media);
}

function subirImagen(telefono, uriUpload){ //FUNCION PARA SUBIR UNA IMAGEN
  const media = MessageMedia.fromFilePath('./publi/'+uriUpload);
  client.sendMessage(telefono, media);
}


//********************FIN DESCARGAR MEDIA*****************************/


//*********************WSP BOT*******************/

client.on('message', async (message) => {
  
    if(message.from === "status@broadcast"){
        // console.log("historia de wsp");
    }else{
        var msj = message.body;
        msj = msj.toLowerCase();
        msj = removeAccents(msj);
        msj = msj.replace(/'/g, "");
        msj = msj.replace(/"/g, "");
        msj = msj.replace(/\\/g, "");
        msj = msj.replace(/\?/g, "");
      
        gestionMensajes(message, msj, message.from);
        
    } 
});



   client.initialize();
   
//*********************FIN WSP BOT*******************/ 


//*********************FUNCIONES DE RESPUESTA DEL BOT*******************/
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 


const Respuestas = require('./respuestas.js');
const { log } = require('console');

async function gestionMensajes(mensaje, texto, telefon){
 
  var telefono="";
  telefono = telefon;
  var msj = texto;
  var nombreUsuario = "usuario"
  var fechaEncuesta = new Date().getTime();
  RANGOMENSAJE = 'usuario';
  if(mensaje.type == 'list_response'){ // si el cliente responde de una lista, extraigo la respuesta y lo guardo en msj
    console.log(mensaje._data.listResponse.singleSelectReply.selectedRowId);
    if(mensaje._data.listResponse.singleSelectReply.selectedRowId == "BOT"){ //si el mensaje es del bot guardamos la descripcion, si no guardamos el title porque es una difucion
      console.log(mensaje._data.listResponse);
      console.log('lista');
      msj = mensaje._data.listResponse.description;
      msj = msj.toLowerCase();
      RANGOMENSAJE = 'medusa';
      nombreUsuario = "medusa";
    }else{
      var urlPerfil = await client.getProfilePicUrl(telefono);
      contactoEncuesta = await mensaje.getContact();     
      contactoEncuesta = contactoEncuesta.pushname;
      var sql = "INSERT INTO encuestas (telefono, fecha, titulo, encuesta, idEncuesta, urlPerfilEncuesta, contactoEncuesta) VALUES('"+telefono+"','"+fechaEncuesta+"','"+mensaje._data.listResponse.title+"','"+mensaje._data.listResponse.description+"','"+mensaje._data.listResponse.singleSelectReply.selectedRowId+"','"+urlPerfil+"','"+contactoEncuesta+"')";
      con.query(sql, function (err, result) {
        if (err) {
          
          client.sendMessage('5492664840533@c.us', 'Crasheo el gestionMensajes\n' + err);
                return console.log("error en insertDataMensaje");
        }
      });
     
      return false;
    }
    
  }
  const contact = await mensaje.getContact();
  
  
  console.log(colors.green(
    "-------------------------------------------------------------" +
    "\nmensaje: " + msj + 
    "\nnombre: " + mensaje['_data'].notifyName + 
    "\nnumero: " + telefono
    ));
        var exiteUsuario = "SELECT telefono FROM clientesactivo WHERE telefono = '"+telefono+"'";
        con.query(exiteUsuario, function (err, result) {
        if (err) {
          
          client.sendMessage('5492664840533@c.us', 'Crasheo el gestionMensajes\n' + err);
                return console.log("error en insertDataMensaje");
        }
       if(result.length > 0){
            //si el cliente tarda en responder
            var fecha= new Date().getTime();
            var sql="UPDATE clientesactivo SET fechaMensaje='"+fecha+"' WHERE telefono = '"+telefono+"'";
            con.query(sql, function (err, result) {
              if (err){
                
                client.sendMessage('5492664840533@c.us', 'Crasheo el gestionMensajes\n' + err);
                return console.log("error en insertDataMensaje");
              }
              console.log("update de clienteActivo, fechaMensaje where telefono", fecha, telefono);
            });
        }else{
          switch(msj){
            case "hola":  
            // const buttons_reply = new Buttons('servicios para empresas', [{body: 'VE EMP', id: 'test-1'}], '', 'footer') 
            
                // const menuPrincipal = {
                //   title: 'Menú Principal',
                //   rows: [
                //     {
                //       title: 'Comunicarte con el área de VENTAS 📡',
                //       description: 'VE',
                //       id: 'BOT'
                //     },
                //     {
                //       title: 'Comunicarte con el área de SERVICIO TECNICO ⚙',
                //       description: 'ST',
                //       id: 'BOT'
                //     },
                //     {
                //       title: 'Comunicarte con el área de COBRANZA 🧮',
                //       description: 'CO',
                //       id: 'BOT'
                //     },
                //   ],
                // };
                // subirImagen(telefono, 'publiInicial.jpeg');
                setTimeout(() => {
                    client.sendMessage(telefono,
                        'Hola! Soy Medusa 👩‍🦰 tu asistente de hoy. \n ¿En que puedo ayudarte?\n A) Ventas \n B) Cobranza \n C) Solicitar Representante');
                        // const listMenuPrincial = new List('Seleccioná una opción 👇', 'Toca aquí', [menuPrincipal], '¿A dónde querés comunicarte?', 'footer');
                        // client.sendMessage(telefono, listMenuPrincial);
                  }, 2000);
              break;
            case "a":      
                  client.sendMessage(telefono, 'Bienvenido/a al departamento de ventas 💼\n');
            break;
            case "b": 
                  client.sendMessage(telefono, 'Bienvenido/a al departamento de Cobranza 💰\n');
            break;
            case "c": 
            client.sendMessage(telefono,
                  '📲 - *Derivé tu consulta a uno de nuestros representantes*' +'\n'+
                  'En minutos se pondrán en contacto con vos!' +'\n'+
                  '¡Gracias por elegirnos *_'+contact.pushname+'_*!'+'\n - *Te saluda tu asistente, Medusa 👩‍🦰*');
                  comprobarTelefono(telefono, 'ventas' , mensaje);
                  mensaje.body="*El cliente quiere necesita ayuda para abonar su factura.*";
            break;
            // const menuVentas = {
            //   title: 'Menú Ventas',
            //   rows: [
            //     {
            //       title: 'Conocer los servicios para EMPRESAS 🏭',
            //       description: 'EM',
            //       id: 'BOT'
            //     },
            //     {
            //       title: 'Conocer los servicios para HOGAR 🙋‍♂️',
            //       description: 'HO',
            //       id: 'BOT'
            //     },
            //     {
            //       title: 'Volver al menu anterior ⬅',
            //       description: 'ATRAS',
            //       id: 'BOT'
            //     }
            //   ],
            // };
            // const listMenuVentas = new List('Elegi una opción 👇', 'Toca aquí', [menuVentas], '👩‍💼 Bienvenido/a al departamento de *Ventas* 📡 \n ¿En qué te puedo ayudar?', 'footer');
            // client.sendMessage(telefono, listMenuVentas);
             
              // break;
            //   case "st": 
            //   const menuServicioTecnico = {
            //     title: 'Menú Servicio Técnico',
            //     rows: [
            //       {
            //         title: 'NO tenés INTERNET en este momento 📡',
            //         description: 'NI',
            //         id: 'BOT'                  
            //       },
            //       {
            //         title: 'SOLICITAR REPRESENTANTE🔧',
            //         description: 'ST REP',
            //         id: 'BOT'                  
            //       },
            //       {
            //         title: 'Volver al menu anterior ⬅',
            //         description: 'ATRAS',
            //         id: 'BOT'                  
            //       }
            //     ],
            //   };     
            //   const listMenuServicioTecnico = new List('Elegí una opción 👇', 'Toca aquí', [menuServicioTecnico], '👩‍🔧 Bienvenido/a al departamento de *Soporte Técnico* 🔧 \n ¿Cómo puedo ayudarte?', 'footer');
            //   client.sendMessage(telefono, listMenuServicioTecnico);
            //   break;
            //   case "co":  
            //   const menuCobranza = {
            //     title: 'Menú Cobranza',
            //     rows: [
            //       {
            //         title: 'NUEVOS MEDIOS DE PAGO 💳',
            //         description: 'MEP',
            //         id: 'BOT' 
            //       },
            //       {
            //         title: 'Solicitar CUPÓN DE PAGO / FACTURA 🖨',
            //         description: 'FA',
            //         id: 'BOT' 
            //       },
            //       {
            //         title: 'Enviar COMPROBANTE DE PAGO 📝',
            //         description: 'COM',
            //         id: 'BOT' 
            //       },
            //       {
            //         title: 'SOLICITAR REPRESENTANTE 🧑‍💼',
            //         description: 'CO REP',
            //         id: 'BOT' 
            //       },
            //       {
            //         title: 'Volver al menu anterior ⬅',
            //         description: 'ATRAS',
            //         id: 'BOT' 
            //       }
            //     ],
            //   };       
            //   const listMenuCobranza = new List('¿En qué te puedo ayudar? 👇', 'Toca aquí', [menuCobranza], '👩‍💼 Bienvenido/a al departamento de cobranza', 'footer');
            //   client.sendMessage(telefono, listMenuCobranza);
              
            //   break;
  
            //   case "app":    
            //   const menuApp = {
            //     title: 'Menú APP',
            //     rows: [
            //       {
            //         title: 'veamos la seccion MIS DATOS',
            //         description: 'MD',
            //         id: 'BOT'
            //       },
            //       {
            //         title: 'veamos la seccion MIS FACTURAS',
            //         description: 'MF',
            //         id: 'BOT'
            //       },
            //       {
            //         title: 'veamos la seccion MIS TICKETS',
            //         description: 'MT',
            //         id: 'BOT'
            //       },
            //       {
            //         title: 'veamos la seccion PAGAR con MERCADO PAGO',
            //         description: 'PMP',
            //         id: 'BOT'
            //       },
            //       {
            //         title: 'Volver al menu anterior ⬅',
            //         description: 'ATRAS',
            //         id: 'BOT'
            //       }
            //     ],
            //   };    
            //   client.sendMessage(telefono, '🙋‍♀️ Veamos nuestra APP 📱' + '\n' +
            //   'Podes descargar la APP en *Google Play* haciendo click en el siguiente enlace' + '\n' +
            //   '👉 https://play.google.com/store/apps/details?id=sidecom.ispcube.com&hl=es 👈' + '\n' +
            //   'Por el momento solo esta disponible para dispositivos Android 📱');
  
            //   const listMenuApp = new List('Toca abajo para ver las opciones 👇', 'Toca aquí', [menuApp], 'Elegí una opción', 'footer');
            //   client.sendMessage(telefono, listMenuApp);
            //   // client.sendMessage(telefono,
            //   //   'Escribí:' + '\n' +
            //   //   '*MD* para que veamos la seccion *Mis Datos*' + '\n' +
            //   //   '*MF* para que veamos la seccion *Mis Facturas*' + '\n' +
            //   //   '*MT* para que veamos la seccion *Mis Tickets*' + '\n' +
            //   //   '*PMP* para que veamos la seccion *Pagar con Mercado Pago*' + '\n' +
            //   //   '*ATRAS* para volver al menu principal ⬅');
              
            //   break;
  
            //   case "atras":  
            //   const menuAtras = {
            //     title: 'Menú Atrás',
            //     rows: [
            //       {
            //         title: 'Comunicarte con el área de VENTAS 📡',
            //         description: 'VE',
            //         id: 'BOT' 
            //       },
            //       {
            //         title: 'Comunicarte con el área de SERVICIO TECNICO ⚙',
            //         description: 'ST',
            //         id: 'BOT' 
            //       },
            //       {
            //         title: 'Comunicarte con el área de COBRANZA 🧮',
            //         description: 'CO',
            //         id: 'BOT' 
            //       },
                  
            //     ],
            //   };
            //   const listMenuAtras = new List('Toca abajo para ver las opciones 👇', 'Toca aquí', [menuAtras], 'Elegí una opción', 'footer');
            //   client.sendMessage(telefono, listMenuAtras);
            //     // client.sendMessage(telefono, 'Escribí:' + '\n' +
            //     // '*VE* para comunicarte con el area de *Ventas* 📡' + '\n' +
            //     // '*ST* para comunicarte con el area de *Servicio Tecnico* ⚙' + '\n' +
            //     // '*CO* para comunicarte con el area de *Cobranza* 🧮' + '\n' +
            //     // '*AD* para comunicarte con el area de *Administracion* 🗃'+ '\n' +
            //     // '*APP* para conocer mas sobre nuestra nueva *App* 📱');
                
           
            //   break;
            //   case "em":      
            //   client.sendMessage(telefono, '👩‍💼 Te ofrezco esta amplia gama de servicios para empresas 🚀' + '\n\n' +
            //   '📡 - *Internet simétrico/asimétrico hasta 1000MB*' + '\n' +
            //   '📞 - *Telefonía VoIp / Servicio 0800*' + '\n' +
            //   '☎ - *Centrales Telefónicas*' + '\n' +
            //   '🖥 - *Obras de redes / Certificaciones*' + '\n' +
            //   '💾 - *Servidores de datos - IP Pública*');
  
            //   client.sendMessage(telefono,
            //     '📡 - *Derivé tu consulta a uno de nuestros representantes*' +'\n'+
            //     'En minutos se pondrán en contacto con vos!' +'\n'+
            //     '🙆‍♀️ ¡Gracias por elegirnos *_'+contact.pushname+'_*!'+'\n - *Te saluda tu asistente, SIDE 👩‍🦰*');
            
            //   comprobarTelefono(telefono, 'ventas' , mensaje);
            //   mensaje.body="*El cliente quiere saber sobre los servicios para Empresas*";
            //   break;
            //   case "ve emp":      
            //   client.sendMessage(telefono,
            //     '📡 - *Derivé tu consulta a uno de nuestros representantes*' +'\n'+
            //     'En minutos se pondrán en contacto con vos!' +'\n'+
            //     '🙆‍♀️ ¡Gracias por elegirnos *_'+contact.pushname+'_*!'+'\n - *Te saluda tu asistente, SIDE 👩‍🦰*');
              
            //   comprobarTelefono(telefono, 'ventas' , mensaje);
            //   mensaje.body="*El cliente quiere saber sobre los servicios para empresas*";
            //   break;
        
            //   case "ho":      
            //   client.sendMessage(telefono, 
            //     '👩‍💼 Te ofrezco esta amplia gama de servicios para el Hogar 🎮📱💻' + '\n\n' +
            //     '📡 - *Internet / Internet Fibra Óptica*' + '\n' +
            //     '📺 - *TV Digital*' + '\n' +
            //     '📞 - *Telefonía VoIp*' + '\n' +
            //     '🖨 - *Obra de Redes*' + '\n' +
            //     '🎁 - *Packs*');
            //     client.sendMessage(telefono,
            //       '📡 - *Derivé tu consulta a uno de nuestros representantes*' +'\n'+
            //       'En minutos se pondrán en contacto con vos!' +'\n'+
            //       '🙆‍♀️ ¡Gracias por elegirnos *_'+contact.pushname+'_*!'+'\n - *Te saluda tu asistente, SIDE 👩‍🦰*');
            //     comprobarTelefono(telefono, 'ventas' , mensaje);
            //     mensaje.body="*El cliente quiere saber sobre los servicios para Hogar*";
            //   break;
            //   case "ve ho":      
            //   client.sendMessage(telefono,
            //     '📡 - *Derivé tu consulta a uno de nuestros representantes*' +'\n'+
            //     'En minutos se pondrán en contacto con vos!' +'\n'+
            //     '🙆‍♀️ ¡Gracias por elegirnos *_'+contact.pushname+'_*!'+'\n - *Te saluda tu asistente, SIDE 👩‍🦰*');
              
            //   comprobarTelefono(telefono, 'ventas' , mensaje);
            //   mensaje.body="*El cliente quiere saber sobre los servicios para hogar*"
              
            //   break;
            //   case "st rep":      
            //   client.sendMessage(telefono,  '📡 - *Derivé tu consulta a uno de nuestros representantes*' +'\n'+
            //   'En minutos se pondrán en contacto con vos!' +'\n'+
            //   '🙆‍♀️ ¡Gracias por elegirnos *_'+contact.pushname+'_*!'+'\n - *Te saluda tu asistente, SIDE 👩‍🦰*');
            //   comprobarTelefono(telefono, 'tecnico');
            //   mensaje.body="*El cliente quiere ayuda por el funcionamiento de su conexión*";
            //   break;
            //   case "ni":      
            //   client.sendMessage(telefono,
            //     '¡NO TENÉS INTERNET!🤦‍♀️' + '\n' +
            //     'Solo si tenés nuestro servicio wireless' + '\n' +
            //     'Seguí los siguientes pasos: 👇👇👇 ');
            //     setTimeout(function(){
            //     client.sendMessage(telefono,
            //             '1️⃣ - Desenchufar el *ROUTER* y el *CONECTOR POE* del tomacorriente durante 5 minutos. 🔌');
            //         }, 2000);
            //     setTimeout(function(){
            //     client.sendMessage(telefono,'2️⃣ - Volver a enchufarlos y espere a que enciendan todas las luces del router.');
            //         }, 6000);
            //         setTimeout(() => {
            //             client.sendMessage(telefono,
            //             '3️⃣ - Intente conectarse a internet.');
            //         }, 10000);
            //     setTimeout(() => {
                 
            //       client.sendMessage(telefono,
            //           '🕘 Nuestro horario de atención es de Lunes a Sabados de 9:00 a 00:00 horas' + '\n' +
            //           `En minutos se pondrán en contacto con vos! ` +'\n'+
            //           '🖥 - *Derivé tu Reclamo a uno de nuestros representantes*' + '\n' +
            //           '🙆‍♀️ ¡Gracias por elegirnos *_'+contact.pushname+'_*!'+'\n - *Te saluda tu asistente, SIDE 👩‍🦰*');
                      
            //     }, 14000);
            //         // 
            //         comprobarTelefono(telefono, 'tecnico');
            //         mensaje.body="*El cliente solicita ayuda por su conexión de internet*"
            //   break;
          
            //   case "fa":      
            //   client.sendMessage(telefono,
            //     '✅ A partir de ahora podrás pagar y descargar tus facturas a través de:   \n 👉  sidecomcliente.com.ar'
            //   );
            //   client.sendMessage(telefono,
            //       'Podés ingresar de la siguiente manera:' + '\n' +
            //       '📲 Usuario: DNI del titular del servicio '+'\n' +
            //       'Contraseña: 123');
                  
            //       const menuFa = {
            //         title: 'Menú Volver',
            //         rows: [
            //           {
            //             title: 'NUEVOS MEDIOS DE PAGO 💳',
            //             description: 'MEP',
            //             id: 'BOT' 
            //           },
            //           {
            //             title: 'Solicitar CUPÓN DE PAGO / FACTURA 🖨',
            //             description: 'FA',
            //             id: 'BOT' 
            //           },
            //           {
            //             title: 'Enviar COMPROBANTE DE PAGO 📝',
            //             description: 'COM',
            //             id: 'BOT' 
            //           },
            //           {
            //             title: 'SOLICITAR REPRESENTANTE'+ '\n' + 'del departamento de COBRANZA 🧑‍💼',
            //             description: 'CO REP',
            //             id: 'BOT' 
            //           },
            //           {
            //             title: 'Volver al menu anterior ⬅',
            //             description: 'ATRAS',
            //             id: 'BOT' 
            //           }
            //         ],
            //       };
            //       const listMenuFa = new List('Elegí una de las siguientes opciones 👇', 'Toca aquí', [menuFa], '👩‍🦰 Si tenés más consultas', 'footer');
            //       client.sendMessage(telefono, listMenuFa);
            //       client.sendMessage(telefono, ' 👩‍🦰 Muchas gracias por comunicarse con SIDECOM INTERNET 📡📞📺💻');
           
            //   break;
            //   case "com":      
            //   client.sendMessage(telefono,
            //     '✅ Por favor envianos tu comprobante en el siguiente mensaje');
  
             
            //   break;
            //   case "mep":      
            //   const menuMep = {
            //     title: 'Menú Volver',
            //     rows: [
            //       {
            //         title: 'NUEVOS MEDIOS DE PAGO 💳',
            //         description: 'MEP',
            //         id: 'BOT' 
            //       },
            //       {
            //         title: 'Solicitar CUPÓN DE PAGO / FACTURA 🖨',
            //         description: 'FA',
            //         id: 'BOT' 
            //       },
            //       {
            //         title: 'Enviar COMPROBANTE DE PAGO 📝',
            //         description: 'COM',
            //         id: 'BOT' 
            //       },
            //       {
            //         title: 'SOLICITAR REPRESENTANTE'+ '\n' + 'del departamento de COBRANZA 🧑‍💼',
            //         description: 'CO REP',
            //         id: 'BOT' 
            //       },
            //       {
            //         title: 'Volver al menu anterior ⬅',
            //         description: 'ATRAS',
            //         id: 'BOT' 
            //       }
            //     ],
            //   };
            //   const listMenuMep = new List('Elegí una de las siguientes opciones 👇', 'Toca aquí', [menuMep], '👩‍🦰 Si tenés más consultas', 'footer');
            //    client.sendMessage(telefono, '👩‍🦰 Te envío una guía con todos nuestros medios de pagos disponibles');
            //   subirImagen(telefono,'metodosDePagoSidecom.pdf');
            //   setTimeout(function(){
            //     client.sendMessage(telefono, listMenuMep);
            //     client.sendMessage(telefono, ' 👩‍🦰 Muchas gracias por comunicarse con SIDECOM INTERNET 📡📞📺💻');
            //   },3000);
            //   break;
            //   case "co rep":      
            //   client.sendMessage(telefono,  '📡 - *Derivé tu consulta a uno de nuestros representantes*' +'\n'+
            //   'En minutos se pondrán en contacto con vos!' +'\n'+
            //   '🙆‍♀️ ¡Gracias por elegirnos *_'+contact.pushname+'_*!'+'\n - *Te saluda tu asistente, SIDE 👩‍🦰*');
              
              
            //   comprobarTelefono(telefono, 'cobranza');
            //   mensaje.body="*El cliente solicita ayuda de un representante de cobranza*";
            //   break;
              
              
            //   case 'md':
            //         subirImagen(telefono, 'misdatos.jpg');
            //         setTimeout(function(){
            //         client.sendMessage(telefono,
            //             '*Mis Datos* 📝' + '\n' +
            //             'En esta seccion podrás ver los datos de tu cuenta' + '\n' +
            //             'Es importante que *_Corrobores tus Datos Personales_* 👀' + '\n' +
            //             'Si alguno de tus datos *NO* es correcto, contactate al numero que se menciona en la APP 📲');
            //             const menuMd = {
            //               title: 'Menú Volver',
            //               rows: [
            //                 {
            //                   title: 'veamos la seccion MIS DATOS',
            //                   description: 'MD',
            //                   id: 'BOT'
            //                 },
            //                 {
            //                   title: 'veamos la seccion MIS FACTURAS',
            //                   description: 'MF',
            //                   id: 'BOT'
            //                 },
            //                 {
            //                   title: 'veamos la seccion MIS TICKETS',
            //                   description: 'MT',
            //                   id: 'BOT'
            //                 },
            //                 {
            //                   title: 'veamos la seccion PAGAR con MERCADO PAGO',
            //                   description: 'PMP',
            //                   id: 'BOT'
            //                 },
            //                 {
            //                   title: 'Volver al menu anterior ⬅',
            //                   description: 'ATRAS',
            //                   id: 'BOT'
            //                 }
            //               ],
            //             };
            //             const listMenuMd = new List('Toca abajo para ver las opciones 👇', 'Toca aquí', [menuMd], 'Elegí una opción', 'footer');
            //             client.sendMessage(telefono, listMenuMd);
            //             // client.sendMessage(telefono,
            //             //     'Si tenes mas consultas' + '\n' +
            //             //     'Escribí:' + '\n' +
            //             //     '*MD* para que veamos la seccion *Mis Datos*' + '\n' +
            //             //     '*MF* para que veamos la seccion *Mis Facturas*' + '\n' +
            //             //     '*MT* para que veamos la seccion *Mis Tickets*' + '\n' +
            //             //     '*PMP* para que veamos la seccion *Pagar con Mercado Pago*' + '\n' +
            //             //     '*ATRAS* para volver al menu principal ⬅');
            //         }, 1500);
            //         break;
            //     case 'mf':
            //         subirImagen(telefono, 'misfacturas.jpg');
            //         setTimeout(function(){
            //         client.sendMessage(telefono,
            //             '*Mis Facturas* 📄' + '\n' +
            //             'En este modulo te damos la posibilidad de ver tus facturas e imprimirlas' + '\n' +
            //             'Por otro lado, vas a poder ver el estado de tu cuenta corriente.'+ '\n' +
            //             '*¿Como funciona?*' + '\n' +
            //             '-Las celdas pintadas de *Rojo* son las facturas que emitimos y en *Verde* veras tus pagos.'+ '\n' +
            //             '-*_Haciendo click_* en el *ojo* de la celda, podras ver la factura en detalle e imprimirla si lo deseas.'+ '\n' +
            //             '-La factura se descarga en los archivos del telefono.');
            //             const menuMf = {
            //               title: 'Menú Volver',
            //               rows: [
            //                 {
            //                   title: 'veamos la seccion MIS DATOS',
            //                   description: 'MD',
            //                   id: 'BOT'
            //                 },
            //                 {
            //                   title: 'veamos la seccion MIS FACTURAS',
            //                   description: 'MF',
            //                   id: 'BOT'
            //                 },
            //                 {
            //                   title: 'veamos la seccion MIS TICKETS',
            //                   description: 'MT',
            //                   id: 'BOT'
            //                 },
            //                 {
            //                   title: 'veamos la seccion PAGAR con MERCADO PAGO',
            //                   description: 'PMP',
            //                   id: 'BOT'
            //                 },
            //                 {
            //                   title: 'Volver al menu anterior ⬅',
            //                   description: 'ATRAS',
            //                   id: 'BOT'
            //                 }
            //               ],
            //             };
            //             const listMenuMf = new List('Toca abajo para ver las opciones 👇', 'Toca aquí', [menuMf], 'Elegí una opción', 'footer');
            //             client.sendMessage(telefono, listMenuMf);
            //             // client.sendMessage(telefono,
            //             //     'Si tenes mas consultas' + '\n' +
            //             //     'Escribí:' + '\n' +
            //             //     '*MD* para que veamos la seccion *Mis Datos*' + '\n' +
            //             //     '*MF* para que veamos la seccion *Mis Facturas*' + '\n' +
            //             //     '*MT* para que veamos la seccion *Mis Tickets*' + '\n' +
            //             //     '*PMP* para que veamos la seccion *Pagar con Mercado Pago*' + '\n' +
            //             //     '*ATRAS* para volver al menu principal ⬅');
            //         }, 1500);
            //         break;
            //     case 'mt':
            //         subirImagen(telefono, 'mistickets.jpg');
            //         setTimeout(function(){
            //             client.sendMessage(telefono,
            //                 '*Mis Tickets* 📝' + '\n' +
            //                 'En esta seccion podes cargar y ver el seguimiento de tus tickets de servicio tecnico o reclamo'+ '\n' +
            //                 '*_Haciendo click_* en el boton *NUEVO* podras crear un nuevo ticket');
            //         }, 1300);
            //         setTimeout(() => {
            //             subirImagen(telefono, 'mistickets2.jpg');
            //             client.sendMessage(telefono,
            //                 'Cuando presiones en *NUEVO*' + '\n' +
            //                 'Veras esta interfaz, en la cual podes cargar tu ticket de servicio tecnico o reclamo.' + '\n' +
            //                 'Tambien podes enviarnos una foto del inconveniente si lo deseas.');
            //         }, 4000);
            //         setTimeout(() => {
            //           const menuMt = {
            //             title: 'Menú Volver',
            //             rows: [
            //               {
            //                 title: 'veamos la seccion MIS DATOS',
            //                 description: 'MD',
            //                 id: 'BOT'
            //               },
            //               {
            //                 title: 'veamos la seccion MIS FACTURAS',
            //                 description: 'MF',
            //                 id: 'BOT'
            //               },
            //               {
            //                 title: 'veamos la seccion MIS TICKETS',
            //                 description: 'MT',
            //                 id: 'BOT'
            //               },
            //               {
            //                 title: 'veamos la seccion PAGAR con MERCADO PAGO',
            //                 description: 'PMP',
            //                 id: 'BOT'
            //               },
            //               {
            //                 title: 'Volver al menu anterior ⬅',
            //                 description: 'ATRAS',
            //                 id: 'BOT'
            //               }
            //             ],
            //           };
            //           const listMenuMt = new List('Toca abajo para ver las opciones 👇', 'Toca aquí', [menuMt], 'Elegí una opción', 'footer');
            //           client.sendMessage(telefono, listMenuMt);
            //             // client.sendMessage(telefono,
            //             //     'Si tenes mas consultas' + '\n' +
            //             //     'Escribí:' + '\n' +
            //             //     '*MD* para que veamos la seccion *Mis Datos*' + '\n' +
            //             //     '*MF* para que veamos la seccion *Mis Facturas*' + '\n' +
            //             //     '*MT* para que veamos la seccion *Mis Tickets*' + '\n' +
            //             //     '*PMP* para que veamos la seccion *Pagar con Mercado Pago*' + '\n' +
            //             //     '*ATRAS* para volver al menu principal ⬅');
            //         }, 7000);
            //         break;
            //     case 'pmp':
            //         subirImagen(telefono, 'menuapp.jpg');
            //         setTimeout(function(){
            //             client.sendMessage(telefono,
            //                 '*Pagar con Mercado Pago* 💳' + '\n' +
            //                 'En esta seccion podrás pagar con Mercado Pago' + '\n' +
            //                 '*Solo veras esta opcion, cuando tu cuenta corriente posea deuda*' + '\n' +
            //                 '- Para pagar solo tenes que *_hacer click_* en el boton *Pagar Con Mercado Pago*')
            //         }, 1500);
            //         setTimeout(() => {
            //             client.sendMessage(telefono,
            //             'Podras seguir con el proceso de pago desde la plataforma de mercado pago.');
            //             subirImagen(telefono, 'pmp.jpg');
            //         }, 3000);
            //         setTimeout(() => {
            //           const menuPmp = {
            //             title: 'Menú Volver',
            //             rows: [
            //               {
            //                 title: 'veamos la seccion MIS DATOS',
            //                 description: 'MD',
            //                 id: 'BOT'
            //               },
            //               {
            //                 title: 'veamos la seccion MIS FACTURAS',
            //                 description: 'MF',
            //                 id: 'BOT'
            //               },
            //               {
            //                 title: 'veamos la seccion MIS TICKETS',
            //                 description: 'MT',
            //                 id: 'BOT'
            //               },
            //               {
            //                 title: 'veamos la seccion PAGAR con MERCADO PAGO',
            //                 description: 'PMP',
            //                 id: 'BOT'
            //               },
            //               {
            //                 title: 'Volver al menu anterior ⬅',
            //                 description: 'ATRAS',
            //                 id: 'BOT'
            //               }
            //             ],
            //           };
            //           const listMenuPmp = new List('Toca abajo para ver las opciones 👇', 'Toca aquí', [menuPmp], 'Elegí una opción', 'footer');
            //           client.sendMessage(telefono, listMenuPmp);
            //             // client.sendMessage(telefono,
            //             //     'Si tenes mas consultas' + '\n' +
            //             //     'Escribí:' + '\n' +
            //             //     '*MD* para que veamos la seccion *Mis Datos*' + '\n' +
            //             //     '*MF* para que veamos la seccion *Mis Facturas*' + '\n' +
            //             //     '*MT* para que veamos la seccion *Mis Tickets*' + '\n' +
            //             //     '*PMP* para que veamos la seccion *Pagar con Mercado Pago*' + '\n' +
            //             //     '*ATRAS* para volver al menu principal ⬅');
            //         }, 4000);
            //         break;
          
                // case 'atras':
                //   const menuAtras2 = {
                //     title: 'Menú Atras',
                //     rows: [
                //       {
                //         title: 'Comunicarte con el área de VENTAS 📡',
                //         description: 'VE'
                //       },
                //       {
                //         title: 'Comunicarte con el área de SERVICIO TECNICO ⚙',
                //         description: 'ST'
                //       },
                //       {
                //         title: 'Comunicarte con el área de COBRANZA 🧮',
                //         description: 'CO'
                //       },
                //       {
                //         title: 'Conocer mas sobre nuestra nueva APP 📱',
                //         description: 'APP',
                //       }
                //     ],
                //   };
                //   const listMenuAtras2 = new List('Toca abajo para ver las opciones 👇', 'Toca aquí', [menuAtras2], 'Elegí una opción', 'footer');
                //   client.sendMessage(telefono, listMenuAtras2);
                //   break;
                default:
                  var random = getRandomInt(3);
                    if(random == 0){
                      client.sendMessage(telefono,
                      `¡Hola ${contact.pushname}! Soy Medusa 👩‍🦰` + '\n' +
                      'Escribí: *_HOLA_* para interactuar conmigo');
                    }else if(random == 1){
                       client.sendMessage(telefono,
                        '¡Hola! 👋 Soy un asistente virtual, estoy para ayudarte 😊 '+'\n'+
                         'Por favor ingresa *HOLA* para que pueda derivarte al área que necesitas');
                    }else{
                      client.sendMessage(telefono,
                        `Hola ${contact.pushname} 👋 soy Medusa 👩‍🦰 Para ayudarte por favor ingresa *HOLA*`);
                    }
                    console.log("mensaje default");
                  console.log("mensaje default");
                  break;
                }
                
        }
      });   
      insertDataMensaje(mensaje, 1, RANGOMENSAJE, nombreUsuario);
      
     
  
    
}




//*********************FUNCIONES DE RESPUESTA DEL BOT *******************/