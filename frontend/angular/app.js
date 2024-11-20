bot.controller(
  "wspController",
  function (
    $window,
    $scope,
    $http,
    $cookies,
    $filter,
    $timeout,
    $rootScope,
    $interval,
    hostValue
  ) {
    $scope.rangoSeleccionado = '';
    $scope.filtroClientesActivos = ''
    $scope.handleFiltroAdmin = (rango) => {
      $scope.filtroClientesActivos = { infoCliente: { rango: rango } };
      $scope.rangoSeleccionado = rango;
    }
    

    // region VARIABLES
    $scope.spinner = true;
    
    // $scope.chatClass = 'chat fade-in';
    $scope.cajaRegistro = 'cajaRegistro fade-in'
    $timeout(() => {
      $scope.cajaRegistro = 'cajaRegistro'
    },1000);
    
    var rangoUsuario = $cookies.get("rango");
    $scope.mostraGuardarDatosCliente = true;
    const hostWeb = hostValue; //cambiar por 127.0.0.1
    $scope.rangoActual = rangoUsuario;
    $scope.nombreUsuarioCookie = $cookies.get("usuario");
    $scope.objEmpleados = [];
    $scope.notificaciones = [];
    // $scope.hayNuevoMensaje = [];
    // const fileReader = new FileReader();
    // $scope.esChat = true;
    $scope.esArchivo = false;
    // $scope.obtenerContacto = $http.get(hostWeb+":8081/contactos");
    $scope.arContactos = [];
    // $scope.showAlert = false;
    $scope.registroMensaje = true;
    $scope.chatMensaje = true;
    $scope.mostrarEnviarMensaje = false;
    $scope.btnVolver = false;
    $scope.modoDios = false;
    $scope.mostrarMenuCard = false;
    $scope.showDatosDelCliente = false;
    $scope.mostrarMenuBotones = true;
    $scope.chatModoDios = false;
    var dingSonado = false;
    $scope.contadorUltimoId = 0;
    $scope.mensajes = [];
    $scope.chatCliente =[]; 
// region SOCKETS
const socket = io(hostValue + ":5000", {// Reemplaza esta URL con la URL de tu servidor de sockets
  reconnection: true, // Habilita la reconexión automática
  reconnectionAttempts: 5, // Máximo número de intentos de reconexión
  reconnectionDelay: 2000, // Tiempo de espera (en ms) entre intentos
  reconnectionDelayMax: 5000, // Tiempo máximo de espera entre intentos
  randomizationFactor: 0.5, // Variación aleatoria del tiempo de espera
  timeout: 10000, // Tiempo antes de considerar que la conexión ha fallado
  autoConnect: true // Habilitar la conexión automática en cuanto esté disponible
}); 

socket.on('reconnect_attempt', () => {
  console.log('Intentando reconectar...');
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Reconectado después de ${attemptNumber} intentos`);
});

socket.on('reconnect_error', (error) => {
  console.log('Error al intentar reconectar:', error);
});

socket.on('reconnect_failed', () => {
  console.log('No se pudo reconectar después de varios intentos');
});
let isAudioPlaying = false; // Bandera para controlar si un audio está en reproducción


// Escuchar el evento "connect" para asegurarse de que la conexión se ha establecido

if ($cookies.get("rango") && $cookies.get("usuario")) {
  socket.emit('login', $cookies.get("rango"), $cookies.get("usuario"));
  localStorage.setItem('ultimoId', 0);
}
socket.on('connect', function () {
  socket.on('error', (err) => {
    console.error('Socket error:', err);
});
  $scope.$apply(async function () {
    checkLogin();
    await Promise.all([
      obtenerEmp(), 
      getContactos()
    ]);
    socket.emit("getMensajes", $scope.chatModoDios, localStorage.getItem('ultimoId'), $cookies.get("rango"), $cookies.get("usuario"));
  });
});

socket.on("mensajes", function (data, ultimoId) {
  // Solo actualizar mensajes si no hay audios en reproducción
  
  console.log(ultimoId[0].ultimoId, 'ultimoId');
  
    $timeout(function () {
      $scope.datosRecibidos = data;
      
      $scope.iniciarApp(false, $scope.datosRecibidos);
    }, 0);
    
    localStorage.setItem('ultimoId', ultimoId[0].ultimoId);

});

socket.on('eliminarCliente', function(mens){
  console.log("entra en socket eliminar client", mens)
   // Obtener los teléfonos de los mensajes entrantes
   $timeout(function () {
   const telefonosNuevos = mens.map(nuevaConversacion => nuevaConversacion.infoCliente.telefono);

   // Filtrar clientes que ya no están en los nuevos mensajes
   $scope.mensajes = $scope.mensajes.filter(conversacionExistente => {
       const telefonoExistente = conversacionExistente.infoCliente.telefono;
       const existeEnNuevosMensajes = telefonosNuevos.includes(telefonoExistente);
      //  if(!existeEnNuevosMensajes){
      //    $scope.mostrarEnviarMensaje = false
      //  }
       return existeEnNuevosMensajes;
   });
  }, 0);
})

// Limpiar recursos al salir del controlador
$scope.$on("$destroy", function () {
  socket.disconnect();
});
// #region FIN SOCKETS





    var filtroRango = "filtroRango";
    if (screen.width <= 425) {
      $scope.chatMensaje = false;
      $scope.btnVolver = true;
    }
    $scope.mostrarChat = function () {
      $scope.chatMensaje = true;
      $scope.registroMensaje = false;
    };

    async function getContactos() {
      try {
        $scope.arContactos = [];
        const response = await $http.get(hostWeb + ":8081/contacto/getContactos");
        
        $scope.arContactos = response.data;
        $scope.contactosId = response.data;
        
        $scope.arContactos = $scope.arContactos.map(contacto => {
          contacto.telefono = contacto.telefono.replace("@c.us", "");
          return contacto;
        });
    
        $scope.objContactos = $scope.arContactos.slice(-10);
        
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    }

    // const getContactosCallBack = (callback) => {
    //   $http.get(hostWeb + ":8081/contacto/getContactos").then((response) => {
    //     // console.log("getContactos", response.data);
    //     callback(response.data);
    //   });
    // };

    $scope.mostrarRegistroMensaje = function () {
      $scope.chatMensaje = false;
      $scope.registroMensaje = true;
    };

    //hacer que el elemento con id 'chat' tenga el scroll siempre al final
    $scope.scrollToBottom = function () {
      $timeout(() => {
        var chat = document.getElementById("chatt");
        chat.scrollTop = chat.scrollHeight;
      })
      
    };
    $scope.irADifusion = function () {
      $window.location.href = hostWeb + "/Liryc/frontend/difundir.html";
    };
    $scope.irAEstadisticas = function () {
      $window.location.href = hostWeb + "/Liryc/frontend/estadisticas.html";
    };
    $scope.irATickets = function () {
      $window.location.href = hostWeb + "/Liryc/frontend/tickets.html";
    };
    $scope.irATicketsContacto = function () {
      $window.open(hostWeb + "/Liryc/frontend/tickets.html", "_blank");
    };

    $scope.irAContactos = function () {
      $window.location.href = hostWeb + "/Liryc/frontend/contactos.html";
    };

    $scope.irAEmail = function () {
      $window.location.href = hostWeb + "/Liryc/frontend/email.html";
    };
    $scope.contadorMensajesCliente = 0;
    $scope.contadorMensajes = 0;
    

    // $http.post(hostWeb + ":8081/rango", {
    //   rango: rangoUsuario,
    // });

    // region INICIAR APP
    $scope.iniciarApp = function (refrescar, datosRecibidos) {
      if ($scope.chatModoDios) {
        // variable del checkbox, por defecto en false
        $scope.aletrnarChat = true;
        // value.rango = value.rangoMensaje;
      } else {
        $scope.aletrnarChat = false;
      }

      if (refrescar) {
        // console.log("refrescar entra", refrescar)
        refrescar = false;
        $scope.obtenerMensajes(datosRecibidos);
      } else {
        $scope.obtenerMensajes(datosRecibidos);
      }
    };

    function ding() {
      var x = document.getElementById("audio");
      x.play();
    }
    function checkLogin() {
      if (rangoUsuario == undefined) {
        $window.location.href = hostWeb + "/Liryc/frontend/login.html";
      }
      if ($cookies.get("rango") === "admin") {
        $scope.capaDelasSombrasOperador = true;
      } else {
        $scope.capaDelasSombrasOperador = false;
      }
    }

    $scope.cerrarSesion = function () {
      $http.post(hostWeb + ":8081/login/cerrarSesion", {
        nombre: $cookies.get("usuario"),
      });
      $cookies.remove("rango");
      $cookies.remove("nombre");
      $window.location.href = hostWeb + "/Liryc/frontend/login.html";
    };

    //region CAMBIAR MODO DIOS
    $scope.cambiarModoDios = () => {
      $scope.spinner = true;
      if($scope.chatModoDios){
        socket.emit("getMensajes", $scope.chatModoDios, $scope.contadorUltimoId, $cookies.get("rango"),$cookies.get("usuario"));
      }else{
        socket.emit("getMensajes", $scope.chatModoDios, 0, $cookies.get("rango"),$cookies.get("usuario"));
      }
    };

    $scope.seleccionarContacto = function (contacto) {
      //region PUSH CLIENTE ACTIVO
      // ESTO PERMITE A UN OPERADOR INICIAR UNA NUEVA CONVERSACION CON UN CLIENTE
      // console.log($scope.nombreUsuarioCookie);
      var fecha = new Date();
      var fechaString = $filter("date")(fecha, "dd/MM/yyyy - HH:mm:ss");
      var fechaStringBuscar = $filter("date")(fecha, "dd-MM-yyyy");
      contacto.telefono = contacto.telefono.replace("+", "");
      // console.log("contacto seleccionado");
      $http.post(hostWeb + ":8082/chat/contactoActivo", {
        nombre: contacto.nombre,
        numero: contacto.telefono,
        rangoPrevio: rangoUsuario,
        rangoPosterior: rangoUsuario,
        fecha: fechaString,
        fechaBuscar: fechaStringBuscar,
        nombreUsuario: $scope.nombreUsuarioCookie,
        rangoUsuario,
        ultimoId: 0
      });
    };
    $scope.mostrarMenu = () => {
      $scope.chatCliente = [];
      $scope.nombreCliente = "";
      $scope.nombreClienteCard = "";
      $scope.numeroClienteImagen = "";
      $scope.numeroCliente = "";
      $scope.fotoPerfil = "";
      $scope.showDatosDelCliente = false;
      $scope.mostrarEnviarMensaje = false;
      $scope.mostrarMenuBotones = true;
      $scope.mostrarMenuCard = false;
    };

    async function obtenerEmp() {
      $http.get(hostWeb + ":8082/chat/empleados").then(function (response) {
        var aux = response.data;
        angular.forEach(aux, function (value) {
          if (value.rango !== rangoUsuario && value.rango !== "medusa") {
            $scope.objEmpleados.push(value);
          }
        });
      });
    }

    $scope.seleccionarRegistro = (cliente) => {
      $scope.clienteSeleccionadoCambiarRango = cliente;
      
    };

    $scope.buscarClienteIspCube = () => {
      $scope.datosClienteDesdeIspCube = "";
      const documento = $cookies.get('dniTicket');
    
      $http.post(hostWeb + ':5034/getCliente', { documento })
        .then((response) => {
          $scope.datosClienteDesdeIspCube = response.data;
          return $http.post(hostWeb + ':5034/verConexion', { documento });
        })
        .then((response) => {
          $scope.datosClienteDesdeIspCube.connections = response.data.map((item) => {
            return {
              id: item.id,
              name: item.plan.name,
              user: item.user,
              password: item.password,
              node: item.node
            };
          });
          return $http.post(hostWeb + ':5034/getFactura6', { documento });
        })
        .then((response) => {
          $scope.datosClienteDesdeIspCube.factura = response.data;
          // console.log($scope.datosClienteDesdeIspCube);
        })
        .catch((error) => {
          console.error('Error en la búsqueda del cliente:', error);
        });
        
    };

    //region CAMIAR RANGO CLIENTE
    $scope.cambiarRangoCliente = function (rango) {
      // console.log("rango", rango);
      let cliente = $scope.clienteSeleccionadoCambiarRango;
      // console.log(cliente);
      var fecha = new Date();
      var fechaString = $filter("date")(fecha, "dd/MM/yyyy - HH:mm:ss");
      var fechaBuscar = $filter("date")(fecha, "dd-MM-yyyy");
      var mensaje = "";
      if (rangoUsuario === "admin") {
        mensaje = "*El cliente fue derivado por un administrador*";
      } else {
        mensaje = "*El cliente fue derivado del area " + rangoUsuario + "*";
      }
      // console.log(cliente.telefono);
      // console.log(cliente.rango, "rango mensaje")
      $http.post(hostWeb + ":8082/chat/cambiarRangoCliente", {
          rangoUsuario: rangoUsuario,
          rangoPrevio: rango, // rango donde estaba el mensaje antes de ser derivado
          telefono: cliente.telefono,
          rangoPosterior: cliente.rango, // rango al que se deriva el mensaje
          nombre: cliente.nombre,
          urlPerfil: cliente.avatar,
          fecha: fechaString,
          fechaBuscar: fechaBuscar,
          mensaje: mensaje,
          dispositivo: "bot",
          nombreUsuario: $scope.nombreUsuarioCookie,
          rangoUsuario, //rango del operador que hace la accion,
          ultimoId: 0
        }).then(() => {
          
          $scope.areaDerivacion = rango;
          alerta(
            "Se derivó el cliente " + cliente.nombre + " al área " + rango,
            "success"
          );
        });
    };
    
    //region OBTENER MENSAJES
    $scope.obtenerMensajes = function (mens) {
      
     
    let filtrar = false;
   
     const telefonoActual = $cookies.get("telefono");  // Obtener el teléfono del chat actualmente abierto
    // Ahora trabajar sobre los mensajes existentes y los nuevos
    mens.forEach(nuevaConversacion => {
      
        const telefonoNuevo = nuevaConversacion.infoCliente.telefono;

        // Buscar si ya existe una conversación con este cliente en $scope.mensajes
        let conversacionExistente = $scope.mensajes.find(conv => conv.infoCliente.telefono === telefonoNuevo);
        
        if (conversacionExistente) {
          
            // Actualizar la información del cliente en $scope.mensajes
            conversacionExistente.infoCliente = { ...conversacionExistente.infoCliente, ...nuevaConversacion.infoCliente };
           
            conversacionExistente.infoCliente.ultimoMensaje = nuevaConversacion.mensajes[0].mensaje;
            // Añadir los nuevos mensajes asegurando que no haya duplicados
            nuevaConversacion.mensajes.forEach(nuevoMensaje => {
              
                const existeMensaje = conversacionExistente.mensajes.some(msg => msg.idMensaje === nuevoMensaje.idMensaje);
                
                if (!existeMensaje) {
                  // Verificar si el teléfono del nuevo mensaje coincide con el chat actualmente abierto
                  if (telefonoNuevo === telefonoActual) {
                      // Si es el chat activo, agregar el mensaje nuevo al chat visualizado
                      conversacionExistente.mensajes.unshift(nuevoMensaje);
                      pintarMensajes(nuevoMensaje, nuevaConversacion.infoCliente, telefonoActual);  
                      $scope.scrollToBottom();  // Mantener el scroll abajo
                  } 
                  else {
                      // Si no es el chat activo, solo agregar el mensaje en la lista de conversaciones
                      conversacionExistente.mensajes.unshift(nuevoMensaje);
                  }
              }
            });
            
            // Ordenar los mensajes por fecha para mantener el orden cronológico
            // conversacionExistente.mensajes.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        } else {
          
          $scope.mensajes.push(nuevaConversacion);
          filtrar = true;
        }
    });

    if(filtrar){
      $scope.filtrarMensajes(telefonoActual, $scope.mensajes);
      filtrar = false;
    }
    $scope.mensajes.sort((a, b) => new Date(b.mensajes[0]?.idMensaje) - new Date(a.mensajes[0]?.idMensaje));
      $scope.notificaciones = [];
      
      // $scope.chat = mens;
      // console.log($scope.mensajes, "mensajesRegistro");
     
      $scope.spinner = false;
      
       // Actualizar también $scope.chatCliente con los nuevos mensajes
      //  $scope.filtrarMensajes($cookies.get("telefono"), mens);
    };
    
   
  
    //region FILTRAR MENSAJES
    $scope.filtrarMensajes = function (telefono, mens) {
      // console.log(mens, 'nuevomensaje');
      $scope.chatCliente = [];
      console.time("filtrando en app");
      // console.log(telefono);
      if(mens.length > 0 && mens === 'click'){
        $scope.spinner = true;
        $scope.chatClass = 'chat'
        
      }else{
        $scope.esChat = true;
        
        $scope.chatClass = 'chat fade-in'
      }
      
      document.getElementById("inpMensaje").focus();
      
      // $scope.mensaje = ""; // resetea el input del chat cuando se hace click en un registro
      $cookies.put("telefono", telefono);
      var estilo = "";
    
      var arr = $scope.mensajes;
      
      $scope.esArchivo = false;
      // $scope.esChat = true;
      $scope.urlPerfil = "";
      $scope.nombreCliente = "";
      $scope.numeroCliente = "";
      $scope.direccionCliente = "";
      $scope.dniCliente = "";
      $scope.descripcionCliente = "";
     

      var arrayMensajes = [];
      var cliente = {};

      $scope.cajaSeleccionada = [];
      angular.forEach(arr, function (value) {
        if (telefono === value.infoCliente.telefono) {
          
          
          arrayMensajes = value.mensajes;
          // value.infoCliente.seleccionado[value.infoCliente.id] = 'cajaRegistroActive';
          cliente = value.infoCliente;
        }
        // else{
        //   value.infoCliente.seleccionado[value.infoCliente.id] = 'cajaRegistro';
        // }
      
      });
      $scope.nombreCliente = cliente.codigoIspcube  +' '+ cliente.nombre; //"Conversación con: " + 
      $scope.nombreClienteCard = cliente.nombre;
      $scope.numeroClienteImagen = cliente.telefono;
      $scope.numeroCliente = cliente.telefono.replace("@c.us", "");
      
      if (cliente.descripcion === undefined) {
        cliente.descripcion = "";
      }
      if (cliente.direccion === undefined) {
        cliente.direccion = "";
      }
      $scope.descripcionCliente = cliente.descripcion;
      $scope.direccionCliente = cliente.direccion;
      $scope.dniCliente = cliente.dni;

      // $scope.nombreCliente = cliente.codigoIspcube  +' '+ cliente.nombre; //"Conversación con: " 
      // $scope.nombreClienteCard = cliente.nombre;
      // $scope.numeroClienteImagen = cliente.telefono;
      // $scope.numeroCliente = cliente.telefono.replace("@c.us", "");
     
      if (arrayMensajes.length > 0 && cliente !== undefined) {
        $scope.clienteSeleccionadoCambiarRango = cliente;
        $scope.urlPerfil = cliente.avatar;
        
        angular.forEach(arrayMensajes, (mensaje) => {
        
         
          pintarMensajes(mensaje, cliente, telefono, mens)
          // console.log($scope.chatCliente, 'chatcliente');
        
        
        });
        
        // console.log($scope.chatCliente.length === arrayMensajes.length);
          
       
      }
      
      $scope.idContactoSeleccionado = $scope.contactosId
        .filter((item) => {
          return item.telefono+'@c.us' === cliente.telefono; // Filtrar los elementos que no sean 'medusa'
        })
        .map((item2) => {
          return {idContacto: item2.idContacto, dni: item2.dni }; // Obtener solo el ... de cada elemento
        });
      // console.log($scope.idContactoSeleccionado[0].dni, "hola");
      $cookies.put("ticket", $scope.idContactoSeleccionado[0].idContacto);
      $cookies.put("dniTicket", $scope.idContactoSeleccionado[0].dni);
      // $cookies.put("ticket", $scope.idContactoSeleccionado[0].idContacto); original
      // if (evento === "click") {
      //   angular.forEach($scope.notificaciones, function (value, $index) {
      //     if (cliente.telefono === telefono) {
      //       $scope.notificaciones[$index] = "";
      //     }
      //   });
      // }
      
      $scope.chatCliente.reverse();
    
      if(mens === 'click'){
        $scope.scrollToBottom();
        $timeout(function(){
        if($scope.chatCliente.length === arrayMensajes.length){
              $scope.spinner = false;
              $scope.chatClass = 'chat fade-in'
              // $scope.chatClass = 'chat fade-in'
          }
        });
      }else{
        if($scope.chatCliente.length === arrayMensajes.length){
          $scope.scrollToBottom();
          // if (!dingSonado) {
          //   ding();
          //   dingSonado = true; // Establece la bandera a true
          //   $timeout(() => {
          //     dingSonado = false;
          //   },2000)
          // }
      }
      }
      console.timeEnd("filtrando en app");
    };


//region PINTAR MENSAJES
let pintarMensajes = (mensaje,cliente, telefono, mens)=>{
  var down = "#";
  var nombreMedia = "#";
  var rangoMensaje = "";
 
      // console.log(mensaje ,cliente, telefono, 'pintarMensajes')
      nombreMedia = cliente.telefono.replace("@c.us", "") + mensaje.fecha;
      $scope.mostrarLink = false;
      $scope.mostrarMenuBotones = false;
      $scope.mostrarMediaVideo = false;
      $scope.mostrarMenuCard = true;
      $scope.mostrarEnviarMensaje = true;
      $scope.showDatosDelCliente = true;
      $scope.esChat = true;
      $scope.esArchivo = false;
      $scope.telefonoGlobal = telefono;
      $scope.nombreGlobal = cliente.nombre;
      if (mensaje.imgurl === "") {
        $scope.mostrarMediaImagen = false;
        $scope.mostrarMediaVideo = false;
        $scope.mostrarMediaAudio = false;
        $scope.mostrarDocumentoDoc = false;
        $scope.mostrarDocumentoXls = false;
        $scope.mostrarDocumentoPdf = false;
        $scope.mostrarDocumentoCsv = false;
        $scope.mostrarPng = false;
        $scope.mostrarLink = false;
        $scope.media = "";
      }
      if (mensaje.estado == 0) {
        down = "../../../backend/" + mensaje.imgurl;
        estilo = $scope.mensajeStyleMedusa;
        // si el mensaje es del Operador
        rangoMensaje = " - " + mensaje.rangoMensaje;
        $scope.media = "";
        $scope.mostrarMediaImagen = false;
        $scope.mostrarMediaVideo = false;
        $scope.mostrarMediaAudio = false;
        $scope.mostrarDocumentoDoc = false;
        $scope.mostrarDocumentoXls = false;
        $scope.mostrarDocumentoPdf = false;
        $scope.mostrarDocumentoCsv = false;
        $scope.mostrarPng = false;
        $scope.mostrarLink = false;
        controlarMensajeConImagenCliente(mensaje, cliente);
      }if(mensaje.mensaje.includes('https://www.google.com/maps')){
        down = "../../../backend/" + mensaje.imgurl;
        $scope.mostrarMediaImagen = false;
        $scope.mostrarMediaVideo = false;
        $scope.mostrarMediaAudio = false;
        $scope.mostrarDocumentoDoc = false;
        $scope.mostrarDocumentoXls = false;
        $scope.mostrarDocumentoPdf = false;
        $scope.mostrarDocumentoCsv = false;
        $scope.mostrarPng = false;
        $scope.mostrarLink = true;
        $scope.media = "";
        estilo = $scope.mensajeStyleRobotLocation;
        
      }
      else if (mensaje.estado == 1) {
        if (!dingSonado && mens !== 'click') {
          ding();
          dingSonado = true; // Establece la bandera a true
          $timeout(() => {
            dingSonado = false;
          },2000)
        }
        down = "../../../backend/" + mensaje.imgurl;
        // si el mensaje es del cliente
        controlarMensajeConImagen(mensaje, cliente);
        rangoMensaje = "";

        
        estilo = $scope.mensajeStyleCliente;
       
      }else if (mensaje.estado == 2){
        //si el mensaje es de medusa
        estilo = $scope.mensajeStyleRobot;
      }else if(mensaje.estado == 3){
        estilo = $scope.mensajeStyleRobotDatosDerivados;
      }

      //   if (value.rango === undefined) {
      //     console.log(value.rango);
      //     rangoMensaje = " nuevo rango ";
      //   }
      
      var jsonMensajeCliente = {
        idMensaje : mensaje.idMensaje,
        mensaje: mensaje.mensaje,
        fecha: mensaje.fecha,
        estado: mensaje.estado,
        estilo: estilo,
        media: $scope.media,
        img: $scope.img,
        mostrarMediaImagen: $scope.mostrarMediaImagen,
        mostrarMediaVideo: $scope.mostrarMediaVideo,
        mostrarMediaAudio: $scope.mostrarMediaAudio,
        mostrarDocumentoDoc: $scope.mostrarDocumentoDoc,
        mostrarDocumentoXls: $scope.mostrarDocumentoXls,
        mostrarDocumentoPdf: $scope.mostrarDocumentoPdf,
        mostrarDocumentoCsv: $scope.mostrarDocumentoCsv,
        mostrarLink: $scope.mostrarLink,
        mostrarPng: $scope.mostrarPng,
        download: down,
        nombreMedia: nombreMedia,
        rango: rangoMensaje,
        nombreUsuario: mensaje.usuario,
      };
    
      $scope.chatCliente.push(jsonMensajeCliente);
}
    // region CONTROLLER IMAGEN 
    function controlarMensajeConImagenCliente(mensaje, cliente){
      
            if (mensaje.imgurl !== "") {
              $scope.mostrarMediaImagen = false;
              $scope.mostrarMediaVideo = false;
              $scope.mostrarMediaAudio = false;
              $scope.mostrarDocumentoDoc = false;
              $scope.mostrarDocumentoXls = false;
              $scope.mostrarDocumentoPdf = false;
              $scope.mostrarDocumentoCsv = false;
              $scope.mostrarPng = false;
              if (
                mensaje.imgurl.includes(".jpg") ||
                mensaje.imgurl.includes(".jpeg") ||
                mensaje.imgurl.includes(".jfif")
              ) {
                // down = "../../../Liryc/backend/" + mensaje.imgurl;
                $scope.img = {
                  "background-image":
                    "url(../../../Liryc/backend/" + mensaje.imgurl + ")",
                  "background-repeat": "no-repeat",
                  "background-size": "contain",
                  "background-position": "center",
                  width: "300px",
                  height: "300px",
                  "grid-column": "1/ span 2",
                  "grid-row": "1",
                };
                if (screen.width <= 425) {
                  $scope.img = {
                    "background-image":
                      "url(../../../Liryc/backend/" + mensaje.imgurl + ")",
                    "background-repeat": "no-repeat",
                    "background-size": "contain",
                    "background-position": "center",
                    width: "175px",
                    height: "300px",
                    "grid-column": "1/ span 2",
                    "grid-row": "1",
                  };
                }
                mensaje.mensaje = "";
                $scope.mostrarMediaImagen = true;
                $scope.mostrarMediaVideo = false;
                $scope.mostrarMediaAudio = false;
                $scope.mostrarDocumentoDoc = false;
                $scope.mostrarDocumentoXls = false;
                $scope.mostrarDocumentoPdf = false;
                $scope.mostrarDocumentoCsv = false;
                $scope.mostrarPng = false;
              } else if (mensaje.imgurl.includes(".mp4")) {
                $scope.mostrarMediaVideo = true;
                $scope.mostrarMediaImagen = false;
                $scope.mostrarMediaAudio = false;
                $scope.mostrarDocumentoDoc = false;
                $scope.mostrarDocumentoXls = false;
                $scope.mostrarDocumentoPdf = false;
                $scope.mostrarDocumentoCsv = false;
                $scope.mostrarPng = false;
                $scope.media = "../../Liryc/backend/" + mensaje.imgurl;
              } else if (
                mensaje.imgurl.includes(".wav") ||
                mensaje.imgurl.includes(".mp3")
              ) {
                $scope.mostrarMediaAudio = true;
                $scope.mostrarMediaImagen = false;
                $scope.mostrarMediaVideo = false;
                $scope.mostrarDocumentoDoc = false;
                $scope.mostrarDocumentoXls = false;
                $scope.mostrarDocumentoPdf = false;
                $scope.mostrarDocumentoCsv = false;
                $scope.mostrarPng = false;
                $scope.media = "../../Liryc/backend/" + mensaje.imgurl;
              } else if (mensaje.imgurl.includes(".doc")) {
                $scope.mostrarDocumentoDoc = true;
                $scope.mostrarDocumentoXls = false;
                $scope.mostrarDocumentoPdf = false;
                $scope.mostrarDocumentoCsv = false;
                $scope.mostrarMediaImagen = false;
                $scope.mostrarMediaVideo = false;
                $scope.mostrarMediaAudio = false;
                $scope.mostrarPng = false;
                // down = "../../../Liryc/backend/" + mensaje.imgurl;
                nombreMedia =
                  cliente.telefono.replace("@c.us", "") +
                  mensaje.fecha +
                  mensaje.mensaje;
                $scope.media = "";
              } else if (mensaje.imgurl.includes(".xls")) {
                $scope.mostrarDocumentoDoc = false;
                $scope.mostrarDocumentoXls = true;
                $scope.mostrarDocumentoPdf = false;
                $scope.mostrarDocumentoCsv = false;
                $scope.mostrarMediaImagen = false;
                $scope.mostrarMediaVideo = false;
                $scope.mostrarMediaAudio = false;
                $scope.mostrarPng = false;
                // down = "../../../Liryc/backend/" + mensaje.imgurl;
                nombreMedia =
                  cliente.telefono.replace("@c.us", "") +
                  mensaje.fecha +
                  mensaje.mensaje;
                $scope.media = "";
              } else if (mensaje.imgurl.includes(".pdf")) {
                $scope.mostrarDocumentoDoc = false;
                $scope.mostrarDocumentoXls = false;
                $scope.mostrarDocumentoPdf = true;
                $scope.mostrarDocumentoCsv = false;
                $scope.mostrarMediaImagen = false;
                $scope.mostrarMediaVideo = false;
                $scope.mostrarMediaAudio = false;
                $scope.mostrarPng = false;
                // down = "../../../Liryc/backend/" + mensaje.imgurl;
                nombreMedia =
                  cliente.telefono.replace("@c.us", "") +
                  mensaje.fecha +
                  mensaje.mensaje;
                $scope.media = "";
              } else if (mensaje.imgurl.includes(".csv")) {
                $scope.mostrarDocumentoDoc = false;
                $scope.mostrarDocumentoXls = false;
                $scope.mostrarDocumentoPdf = false;
                $scope.mostrarDocumentoCsv = true;
                $scope.mostrarMediaImagen = false;
                $scope.mostrarMediaVideo = false;
                $scope.mostrarMediaAudio = false;
                $scope.mostrarPng = false;
                // down = "../../../Liryc/backend/" + mensaje.imgurl;
                nombreMedia =
                  cliente.telefono.replace("@c.us", "") +
                  mensaje.fecha +
                  mensaje.mensaje;
                $scope.media = "";
              } else if (mensaje.imgurl.includes(".png")) {
                $scope.img = {
                  "background-image":
                    "url(../../../Liryc/backend/" + mensaje.imgurl + ")",
                  "background-repeat": "no-repeat",
                  "background-size": "contain",
                  "background-position": "center",
                  width: "300px",
                  height: "300px",
                  "grid-column": "1/ span 2",
                  "grid-row": "1",
                };
                $scope.mostrarDocumentoDoc = false;
                $scope.mostrarDocumentoXls = false;
                $scope.mostrarDocumentoPdf = false;
                $scope.mostrarDocumentoCsv = false;
                $scope.mostrarMediaImagen = false;
                $scope.mostrarPng = true;
                $scope.mostrarMediaVideo = false;
                $scope.mostrarMediaAudio = false;
                // down = "../../../Liryc/backend/" + mensaje.imgurl;
                nombreMedia =
                  cliente.telefono.replace("@c.us", "") +
                  mensaje.fecha +
                  mensaje.mensaje;
                $scope.media = "";
                mensaje.mensaje = "";
              }
            }
    }
    // region CONTROLLER IMAGEN 
    function controlarMensajeConImagen(mensaje, cliente){
      if (mensaje.imgurl !== "") {
        $scope.mostrarMediaImagen = false;
        $scope.mostrarMediaVideo = false;
        $scope.mostrarMediaAudio = false;
        $scope.mostrarDocumentoDoc = false;
        $scope.mostrarDocumentoXls = false;
        $scope.mostrarDocumentoPdf = false;
        $scope.mostrarDocumentoCsv = false;
        $scope.mostrarPng = false;

        if (
          mensaje.imgurl.includes(".jpg") ||
          mensaje.imgurl.includes(".jpeg") ||
          mensaje.imgurl.includes(".jfif")
        ) {
          // down = "../../../Liryc/backend/" + mensaje.imgurl;
          $scope.img = {
            "background-image":
              "url(../../../Liryc/backend/" + mensaje.imgurl + ")",
            "background-repeat": "no-repeat",
            "background-size": "contain",
            "background-position": "center",
            width: "300px",
            height: "300px",
            "grid-column": "1/ span 2",
            "grid-row": "1",
          };
          if (screen.width <= 425) {
            $scope.img = {
              "background-image":
                "url(../../../Liryc/backend/" + mensaje.imgurl + ")",
              "background-repeat": "no-repeat",
              "background-size": "contain",
              "background-position": "center",
              width: "175px",
              height: "300px",
              "grid-column": "1/ span 2",
              "grid-row": "1",
            };
          }
          mensaje.mensaje = "";
          $scope.mostrarMediaImagen = true;
          $scope.mostrarMediaVideo = false;
          $scope.mostrarMediaAudio = false;
          $scope.mostrarDocumentoDoc = false;
          $scope.mostrarDocumentoXls = false;
          $scope.mostrarDocumentoPdf = false;
          $scope.mostrarDocumentoCsv = false;
          $scope.mostrarPng = false;
        } else if (mensaje.imgurl.includes(".mp4")) {
          $scope.mostrarMediaVideo = true;
          $scope.mostrarMediaImagen = false;
          $scope.mostrarMediaAudio = false;
          $scope.mostrarDocumentoDoc = false;
          $scope.mostrarDocumentoXls = false;
          $scope.mostrarDocumentoPdf = false;
          $scope.mostrarDocumentoCsv = false;
          $scope.mostrarPng = false;
          $scope.media = "../../Liryc/backend/" + mensaje.imgurl;
        } else if (
          mensaje.imgurl.includes(".wav") ||
          mensaje.imgurl.includes(".mp3")
        ) {
          $scope.mostrarMediaAudio = true;
          $scope.mostrarMediaImagen = false;
          $scope.mostrarMediaVideo = false;
          $scope.mostrarDocumentoDoc = false;
          $scope.mostrarDocumentoXls = false;
          $scope.mostrarDocumentoPdf = false;
          $scope.mostrarDocumentoCsv = false;
          $scope.mostrarPng = false;
          $scope.media = "../../Liryc/backend/" + mensaje.imgurl;
        } else if (mensaje.imgurl.includes(".doc")) {
          $scope.mostrarDocumentoDoc = true;
          $scope.mostrarDocumentoXls = false;
          $scope.mostrarDocumentoPdf = false;
          $scope.mostrarDocumentoCsv = false;
          $scope.mostrarMediaImagen = false;
          $scope.mostrarMediaVideo = false;
          $scope.mostrarMediaAudio = false;
          $scope.mostrarPng = false;
          // down = "../../../Liryc/backend/" + mensaje.imgurl;
          nombreMedia =
            cliente.telefono.replace("@c.us", "") +
            mensaje.fecha +
            mensaje.mensaje;
          $scope.media = "";
        } else if (mensaje.imgurl.includes(".xls")) {
          $scope.mostrarDocumentoDoc = false;
          $scope.mostrarDocumentoXls = true;
          $scope.mostrarDocumentoPdf = false;
          $scope.mostrarDocumentoCsv = false;
          $scope.mostrarMediaImagen = false;
          $scope.mostrarMediaVideo = false;
          $scope.mostrarMediaAudio = false;
          $scope.mostrarPng = false;
          // down = "../../../Liryc/backend/" + mensaje.imgurl;
          nombreMedia =
            mensaje.infoCliente.telefono.replace("@c.us", "") +
            mensaje.fecha +
            mensaje.mensaje;
          $scope.media = "";
        } else if (mensaje.imgurl.includes(".pdf")) {
          $scope.mostrarDocumentoDoc = false;
          $scope.mostrarDocumentoXls = false;
          $scope.mostrarDocumentoPdf = true;
          $scope.mostrarDocumentoCsv = false;
          $scope.mostrarMediaImagen = false;
          $scope.mostrarMediaVideo = false;
          $scope.mostrarMediaAudio = false;
          $scope.mostrarPng = false;
          // down = "../../../Liryc/backend/" + mensaje.imgurl;
          nombreMedia =
            cliente.telefono.replace("@c.us", "") +
            mensaje.fecha +
            mensaje.mensaje;
          $scope.media = "";
        } else if (mensaje.imgurl.includes(".csv")) {
          $scope.mostrarDocumentoDoc = false;
          $scope.mostrarDocumentoXls = false;
          $scope.mostrarDocumentoPdf = false;
          $scope.mostrarDocumentoCsv = true;
          $scope.mostrarMediaImagen = false;
          $scope.mostrarMediaVideo = false;
          $scope.mostrarMediaAudio = false;
          $scope.mostrarPng = false;
          // down = "../../../Liryc/backend/" + mensaje.imgurl;
          nombreMedia =
            value.telefono.replace("@c.us", "") +
            mensaje.fecha +
            mensaje.mensaje;
          $scope.media = "";
        } else if (mensaje.imgurl.includes(".png")) {
          $scope.img = {
            "background-image":
              "url(../../../Liryc/backend/" + mensaje.imgurl + ")",
            "background-repeat": "no-repeat",
            "background-size": "contain",
            "background-position": "center",
            width: "300px",
            height: "300px",
            "grid-column": "1/ span 2",
            "grid-row": "1",
          };
          $scope.mostrarDocumentoDoc = false;
          $scope.mostrarDocumentoXls = false;
          $scope.mostrarDocumentoPdf = false;
          $scope.mostrarDocumentoCsv = false;
          $scope.mostrarMediaImagen = false;
          $scope.mostrarMediaVideo = false;
          $scope.mostrarMediaAudio = false;
          $scope.mostrarPng = true;
          // down = "../../../Liryc/backend/" + mensaje.imgurl;
          nombreMedia =
            value.telefono.replace("@c.us", "") +
            mensaje.fecha +
            mensaje.mensaje;
          $scope.media = "";
          mensaje.mensaje = "";
        }
      }
    }
// region ENVIAR MENSAJE
    $scope.enviarMensaje = function (event) {
      var envia = "";
      var url = "";
      var fecha = new Date();
      var fechaString = $filter("date")(fecha, "dd/MM/yyyy - HH:mm:ss");
      var fechaStringBuscar = $filter("date")(fecha, "dd-MM-yyyy");
      if (event.shiftKey && event.key === "Enter") {
        // Si se presiona Shift + Enter, agrega un salto de línea al mensaje
        $scope.mensaje += "\n";
        event.preventDefault();  // Evita que se inserte un salto de línea doble
    } else if ((event.key == "Enter" || event.type == "click") && $scope.mensaje != "") {
        //resetea el input chat
        // console.log($scope.mensaje);
        if ($scope.esArchivo) {
          envia = true;
          url = $scope.mensaje;
        } else {
          envia = false;
        }
        var mensaje = $scope.mensaje;
        // mensaje = mensaje.toLowerCase();
        // mensaje = removeAccents(mensaje);
        mensaje = mensaje.replace(/'/g, "");
        mensaje = mensaje.replace(/"/g, "");
        mensaje = mensaje.replace(/\\/g, "");
        // mensaje = mensaje.replace(/\?/g, ""); es necesario escribir signos y no lo rompe
        // console.log($scope.clienteSeleccionadoCambiarRango.rango)
        $http
          .post(hostWeb + ":8082/chat/mensajeMedusa", {
            nombre: $scope.nombreGlobal,
            telefono: $scope.telefonoGlobal.replace("+", ""),
            from: $scope.telefonoGlobal.replace("+", ""),
            fecha: fechaString,
            fechaBuscar: fechaStringBuscar,
            mensaje: mensaje,
            dispositivo: "bot",
            imgurl: url,
            estado: 0,
            bool: false,
            rango: $scope.rangoActual,
            enviaArchivo: envia,
            nombreUsuario: $scope.nombreUsuarioCookie,
            rangoClienteActivo: $scope.clienteSeleccionadoCambiarRango.rango,
            ultimoId: localStorage.getItem('ultimoId')
          })
          .success(function (value) {
            $scope.mensaje = "";
            // console.log(value);
            // console.log("envia el mensaje");
            // $scope.scrollToBottom();
          });
        //   .finally(() => {
        //     socket.emit(
        //         "filtroRango",
        //         $scope.chatModoDios,
        //         $scope.contadorUltimoId
        //       );
        //   });
      }
    };
    function removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    // region MENSAJE CLIENTE ACTIVO
    $scope.mensajeClienteActivo = function (mensaje, nombre, telefono) {
      // console.log("enviar mensaje cliente activo");
      var fecha = new Date();
      var fechaString = $filter("date")(fecha, "dd/MM/yyyy - HH:mm:ss");
      console.log(localStorage.getItem('ultimoId'));
      
      $http
        .post(hostWeb + ":8082/chat/mensajeMedusa", {
          nombre: nombre,
          telefono: telefono,
          fecha: fechaString,
          mensaje: mensaje,
          dispositivo: "bot",
          imgurl: "",
          estado: 2,
          bool: false,
          rango: "medusa",
          attachmentData: $scope.attachmentData,
          nombreUsuario: "medusa",
          ultimoId: localStorage.getItem('ultimoId')
        })
        .success(function (response) {
          if (response) {
          }
        })
        .finally(function () {
          // $scope.obtenerMensajes();
        });
    };
    // region CERRAR CHAT
    $scope.cerrarChat = function () {
      let telefono = $scope.clienteSeleccionadoCambiarRango.telefono;
      
      $http
        .post(hostWeb + ":8082/chat/cerrarChat", {
          telefono: telefono,
          rangoUsuario,
          rangoPrevio : $scope.clienteSeleccionadoCambiarRango.rango,
          ultimoId: 0
        })
        .success(function (response) {
          $scope.mostrarEnviarMensaje = false;
          if (response) {
            // console.log(response);
          }
        });
    };

    // region ESTILOS
    $scope.fotoPerfil = {
      // 'background-image': 'url('+$scope.urlPerfil+')',
      // 'background-repeat': 'no-repeat',
      // 'background-size': 'contain',
      // "background-position": "center",
      "border-radius": "40px",
      "width": "50px",
      "height": "50px",
      "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",

    };

    $scope.fotoPerfilCard = {
      // 'background-image': 'url('+$scope.urlPerfil+')',
      // 'background-repeat': 'no-repeat',
      // 'background-size': 'contain',
      "background-position": "center",
      "border-radius": "60px",
      "width": "120px",
      "height": "120px",
      "margin": "2% auto",
      "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"

    };

    $scope.mensajeStyleCliente = { // estado = 1
      "border-radius": "0px 19px 19px 19px",
      "background-color": "rgba(255, 255, 255)",
      "box-shadow":
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      "padding": "2% 2%",
      "color": "black",
      "font-size": "17px",
      "font-family": "Roboto, sans-serif",
      // 'font-weight': 'bold',
      "justify-self": "start",
      "align-self": "center",
      "margin-left": "12%",
      "grid-column": "1",
      // 'min-width': '60%',
      "max-width": "90%",
    };

    $scope.mensajeStyleMedusa = { // estado = 0
      "box-shadow":
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      "border-radius": "19px 19px 0px 19px",
      "background-color": "#c4e1f4",
      'padding': "2% 2%",
      'color': "black",
      "font-size": "17px",
      "font-family": "Roboto, sans-serif",
      // 'font-weight': 'bold',
      "justify-self": "center",
      "align-self": "center",
      "margin-left": "auto",
      "margin-right": "5%",
      "grid-column": "1 / span 2",
      "max-width": "46%",
      // 'min-width': '25%',
    };

    
    $scope.mensajeStyleRobot = { // estado == 2
      "box-shadow":
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      "border-radius": "10px",
      "background-color": "#598d9ab3",
      'padding': ".7%",
      'color': "black",
      // "font-size": "17px",
      "font-family": "Roboto, sans-serif",
      // 'font-weight': 'bold',
      "justify-self": "center",
      "align-self": "center",
      // "margin-left": "auto",
      // "margin-right": "5%",
      "grid-column": "1 / span 2",
      "max-width": "40%",
      // 'min-width': '25%',
    };

    $scope.mensajeStyleRobotDatosDerivados = { //estado = 3
      "border-radius": "10px",
      // "box-shadow": "1px 2px 13px 6px rgba(0,0,0,1)",
      "background-color": "#62ae7b",
      'padding': ".7%",
      'color': "black",
      // "font-size": "17px",
      "font-family": "monospace",
      // 'font-weight': 'bold',
      "justify-self": "center",
      "align-self": "center",
      // "margin-left": "auto",
      // "margin-right": "5%",
      "grid-column": "1 / span 2",
      'text-align:': 'center', 
      "max-width": "46%",
      // 'min-width': '25%',
      "white-space": "pre-line" /* Mantiene los saltos de línea */

    };

    $scope.mensajeStyleRobotLocation = { //estado = 3
      "border-radius": "10px",
      // "box-shadow": "1px 2px 13px 6px rgba(0,0,0,1)",
      "background-color": "#62ae7b",
      'padding': ".7%",
      'color': "black",
      // "font-size": "17px",
      "font-family": "monospace",
      // 'font-weight': 'bold',
      "justify-self": "center",
      "align-self": "center",
      // "margin-left": "auto",
      // "margin-right": "5%",
      "grid-column": "1 / span 2",
      'text-align:': 'center', 
      "max-width": "46%",
      // 'min-width': '25%',
      //"white-space": "pre-line" /* Mantiene los saltos de línea */

    };

    $scope.styleFondoGradient = {//
      'background': `var(--light-grad-pink-blue, radial-gradient(ellipse at 40% 0%, #093738 0, transparent 75%), radial-gradient(ellipse at 60% 0%, #096bde10 0, transparent 75%))`
    }

    $scope.cambiarColor = function(colorPicker){
      $scope.styleFondoGradient = {
        'background': `var(--light-grad-pink-blue, radial-gradient(ellipse at 40% 0%, #093738 0, transparent 75%), radial-gradient(ellipse at 60% 0%, ${colorPicker} 0, transparent 75%))`
      };
    }
  // region FIN ESTILOS

    // funcion para enviar archivos
    $scope.url = "";

    //#region ENVIAR ARCHIVO
    $scope.SelectFile = function (e) {
      e.preventDefault();
      $scope.mensaje = "";
      $scope.host = "";
      $scope.attachmentData = "";
      $scope.estiloArchivo = {};
      $scope.urlArchivo = "";
      //  console.log(e)
      let file = document.getElementById("imgDer").files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      $scope.mensaje = file.name;
      $scope.mensaje = $scope.mensaje.replace(/ /g, "");
      // data:image/jpeg;base64,

      reader.addEventListener("load", (event) => {
        $scope.attachmentData = "";
        // console.log($scope.fileUp, event);
        $scope.esArchivo = true;
        $scope.esChat = false;
        $scope.spinner = true;
        $scope.attachmentData = event.target.result;

        let host = "./subir/";
        // console.log($scope.attachmentData);
        $scope.attachmentData = $scope.attachmentData.replace(
          "data:image/jpg;base64,",
          ""
        );
        $scope.attachmentData = $scope.attachmentData.replace(
          "data:image/png;base64,",
          ""
        );
        $scope.attachmentData = $scope.attachmentData.replace(
          "data:image/jpeg;base64,",
          ""
        ); // despues poner un if, para controlar todos los tipos de archivos y hacerle el replace
        $scope.attachmentData = $scope.attachmentData.replace(
          "data:application/pdf;base64,",
          ""
        );
        $scope.attachmentData = $scope.attachmentData.replace(
          "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
          ""
        );
        $scope.attachmentData = $scope.attachmentData.replace(
          "data:audio/wav;base64,",
          ""
        );
        $scope.attachmentData = $scope.attachmentData.replace(
          "data:audio/mpeg;base64,",
          ""
        );
        $scope.attachmentData = $scope.attachmentData.replace(
          "data:video/mp4;base64,",
          ""
        );

        $scope.urlArchivo = host + $scope.mensaje;
        $timeout(() => {
          $scope.spinner = false;
          $scope.estiloArchivo = {
            "background-image":
              "url(../../../Liryc/backend/subir/" + $scope.mensaje + ")",
            "background-position": "center",
            "background-repeat": "no-repeat",
            "background-size": "contain",
            height: "70vh",
            width: "400px",
            "margin-left": "auto",
            "margin-right": "auto",
          };
        }, 1000);

        document.getElementById("inpMensaje").focus();
        $http
          .post(hostWeb + ":8082/chat/guardar", {
            archivo: $scope.attachmentData, //archivo en base 64
            ruta: host, // carpeta donde se va a guardar
            nombre: $scope.mensaje, // nombre del archivo
          })
          .success(function (response) {
            $scope.attachmentData = "";
            host = "";
            $scope.mensaje = "";
            // socket.emit("getMensajes", $scope.chatModoDios, $scope.contadorUltimoId, $cookies.get("rango"), $cookies.get("usuario"));
          });
      });
    };

    // region EDITAR CONTACTO
    $scope.editarContacto = function () {
      // console.log($scope.descripcionCliente);
      // console.log($cookies.get("ticket")); // tiene el id del contacto seleccionado cuando se hace click en la caja de registro
      // console.log($scope.numeroCliente);
      var rangoClienteActivo = $scope.clienteSeleccionadoCambiarRango.rango
      $http
        .post(hostWeb + ":8081/contacto/editarContacto", {
          idContacto: $scope.idContactoSeleccionado[0].idContacto,
          telefono: $scope.numeroCliente + "@c.us",
          nombre: $scope.nombreClienteCard,
          conexion: "",
          nombreCompuesto: $scope.nombreClienteCard,
          descripcion: $scope.descripcionCliente,
          direccion: $scope.direccionCliente,
          urlPerfil: $scope.urlPerfil,
          rangoUsuario,
          rangoClienteActivo,
          dni: $scope.dniCliente,
        })
        .success(function (response) {
          // console.log("editar Contacto");
          // console.log(response);
          if (response) {
            alerta("Se editó el contacto exitosamente!", "warning");
            $cookies.put('dni', $scope.dniCliente);
            // getContactosCallBack((response) => {
            //   $scope.iniciarApp(true, $scope.datosRecibidos, response);
            //   // console.log("inicia app");
            // });
          }
        });
    };

    // region ALERTA (notificacion)
    function alerta(mensaje, status) {
      SnackBar({
        message: mensaje,
        dismissible: true,
        status: status,
        timeout: 25000,
        position: "tr",
      });
      return false;
    }

    // $scope.enviarArchivo=function(i){
    //     if(i=="cerrar"){
    //         $scope.esArchivo=false;
    //         $scope.esChat=true;
    //         $scope.urlArchivo="";
    //     }
    //     if(i == "enviar"){
    //         $scope.esArchivo=false;
    //         $scope.esChat=true;
    //
    //          $scope.urlArchivo="";
    //     }
    // }

    //region BUSCADOR DE CONTACTOS
    $scope.buscarContacto = (contacto) => {
      if (contacto !== undefined) {
        //evento.keyCode === 13 &&
        $scope.objContactos = []; // Vaciar el arreglo antes de cada búsqueda
        angular.forEach($scope.arContactos, (value) => {
          const campos = [
            "idContacto",
            "nombre",
            "telefono",
            "descripcion",
            "direccion",
            "producto",
          ];
          campos.forEach((campo) => {
            if (
              value[campo] &&
              value[campo]
                .toString()
                .toLowerCase()
                .includes(contacto.toLowerCase())
            ) {
              // Usar push para agregar los contactos encontrados al arreglo

              $scope.objContactos.push(value);
            }
          });
        });
        // console.log($scope.objContactos);
      }
    };

    //region IMAGEN NO CARGADA
    $scope.imagenNoCargada = (elementoImg) => {
      
      elementoImg.src = "./style/perfilVacio.png"; // Puedes establecer una imagen predeterminada
      elementoImg.alt = "Error al cargar la imagen";
    };
    

    $scope.hacerZoom = function(urlPerfil){
      $scope.imagenZoom = "";
      $scope.imagenZoom = urlPerfil;
    }
  }
);
