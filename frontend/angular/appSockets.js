bot.controller("wspController", function($window, $scope, $http, $cookies,$filter,$timeout, $rootScope, $interval, hostValue){
    let intervaloMensajes = "";
    $scope.cajaRegistroEstilo = "cajaRegistroEstilo";
    var rangoUsuario = $cookies.get('rango');
    $scope.mostraGuardarDatosCliente= true;
    const hostWeb = hostValue; //cambiar por 127.0.0.1
    $scope.rangoActual = rangoUsuario;
    $scope.nombreUsuarioCookie = $cookies.get('usuario');
    $scope.objEmpleados = [];
    $scope.notificaciones = [];
    $scope.hayNuevoMensaje = [];
    const fileReader = new FileReader();
    $scope.esChat = true;
    $scope.esArchivo = false;
    // $scope.obtenerContacto = $http.get(hostWeb+":8081/contactos");
    $scope.arContactos = [];
    $scope.chatClienteAux  = [];
    $scope.showAlert = false;
    $scope.registroMensaje=true;
    $scope.chatMensaje=true;
    $scope.mostrarEnviarMensaje = true;
    $scope.btnVolver = false;
    $scope.modoDios=false;
    $scope.mostrarMenuCard = false;
    $scope.showDatosDelCliente = false;
    $scope.showDatosDelCliente = false;
    $scope.mostrarMenuBotones = true;
    $scope.chatModoDios = false;
    /////////////////////////////////////////////////////////////SOCKETS////////////////////////////////////
    
    const socket = io(hostValue+':5000',
    {
        auth:{
            serverOffset: 0
        }
    }); // Reemplaza esta URL con la URL de tu servidor de sockets

        // Emitir eventos al servidor
       
   
    
    // Escuchar eventos del servidor
    socket.on('enviarMensaje', (mensaje) => {
        console.log(mensaje);
        // socket.auth.serverOffset = serverOffset
    });
    
 
    
    $scope.enviarDatos = function(datosAEnviar) {
    socket.emit('nombreDelEvento', datosAEnviar);
    };
     
       
    
      // Limpiar recursos al salir del controlador
      $scope.$on('$destroy', function() {
        socket.disconnect();
      });
    
      ////////////////////////////////////////////FIN IMPLEMENTACION DE SOCKETS////////////////////////////////////
    

  
    
    function getContactos(){
        $scope.arContactos = [];
        $http.get(hostWeb+":8081/contacto/getContactos")
        .then((response)=>{
            $scope.arContactos = response.data;
            $scope.contactosId = response.data;
            $scope.objContactos = $scope.arContactos.slice(-10);
            // $scope.objContactos.forEach(function(contacto) {
            //     contacto.telefono = contacto.telefono.replace('@c.us', ''); // Reemplazar todas las ocurrencias de "@c.us"
            //     console.log(contacto.telefono)
            // });
            // console.log("getContactos", $scope.objContactos);
        });
    }
    
    const getContactosCallBack = (callback) =>{
        $http.get(hostWeb+":8081/contacto/getContactos")
        .then((response)=>{
            // console.log("getContactos", response.data);
            callback(response.data)
            
        });
    }

    $scope.contadorMensajesCliente = 0;
    $scope.contadorMensajes = 0;
    checkLogin();
    obtenerEmp();
    getContactos();

    
    $scope.iniciarApp = function(){
        
    }
    
    
    
    function ding(){
        var x = document.getElementById("audio");
        x.play();
    }
    function checkLogin(){
        if(rangoUsuario == undefined){
            $window.location.href = hostWeb+"/medusa/frontend/login.html";
        }
        if($cookies.get('rango') === 'admin'){
            $scope.capaDelasSombrasOperador = true;
        }else{
            $scope.capaDelasSombrasOperador = false;
        }
    }
    
    $scope.cerrarSesion = function(){
        $http.post(hostWeb+":8081/login/cerrarSesion",
        {
            'nombre': $cookies.get('usuario'),
        });
        $cookies.remove('rango');
        $cookies.remove('nombre');
        $window.location.href = hostWeb+"/medusa/frontend/login.html";
       
    }
    

    $scope.seleccionarContacto =  function(contacto){ //ESTO PERMITE A UN OPERADOR INICIAR UNA NUEVA CONVERSACION CON UN CLIENTE
       
        var fecha = new Date();
        var fechaString = $filter('date')(fecha, 'dd/MM/yyyy - HH:mm:ss');
        var fechaStringBuscar = $filter('date')(fecha, 'dd/MM/yyyy');
        contacto.telefono = contacto.telefono.replace('+', '');
      
        $http.post(hostWeb+":8081/chat/contactoActivo",
        {
            'nombre': contacto.nombre,
            'numero': contacto.telefono,
            'rango':rangoUsuario,
            'fecha':fechaString,
            'fechaBuscar': fechaStringBuscar,
            'nombreUsuario': $scope.nombreUsuarioCookie
    
        });
    }
    function obtenerEmp(){
        $http.get(hostWeb+":8081/chat/empleados").then(function(response){
            var aux = response.data;
            angular.forEach(aux, function(value){
                
                if(value.rango !== rangoUsuario && value.rango !== 'medusa'){
                    $scope.objEmpleados.push(value);
                }
            });
        });
    }
    
    $scope.seleccionarRegistro = (cliente) => {
        $scope.clienteSeleccionadoCambiarRango = cliente;
    }
    
    $scope.cambiarRangoCliente = function(rango){
        
        let cliente = $scope.clienteSeleccionadoCambiarRango;
        console.log(cliente);
        var fecha = new Date();
        var fechaString = $filter('date')(fecha, 'dd/MM/yyyy - HH:mm:ss');
        var fechaBuscar = $filter('date')(fecha, 'dd-MM-yyyy');
        var mensaje = "";
        if(rangoUsuario === "admin"){
            mensaje = "*El cliente fue derivado por un administrador*";
        }else{
            mensaje = "*El cliente fue derivado del area "+rangoUsuario+"*";
        }

        $http.post(hostWeb+":8081/chat/cambiarRangoCliente",
        {   'rangoUsuario': rangoUsuario,
            'rango': rango,
            'telefono': cliente.telefono,
            'rangoMensaje': cliente.rangoMensaje,
            'nombre': cliente.nombre,
            'urlPerfil': cliente.urlPerfil,
            'fecha': fechaString,
            'fechaBuscar': fechaBuscar,
            'mensaje': mensaje,
            'dispositivo':"bot",
            'nombreUsuario': $scope.nombreUsuarioCookie
            
        }).finally(()=>{
            $scope.areaDerivacion = rango;
            alerta('Se derivo el cliente ' + cliente.nombre + ' al area '+ rango, 'success');
        });
    }
    
    
    
    $scope.obtenerMensajes = function(mens){
        $scope.notificaciones = [];
        $scope.mensajes = mens;
        $scope.chat = mens;
        $scope.contenedorMensajes=[];

        $scope.aux = [];

        angular.forEach($scope.mensajes, function(value){
           
            if(rangoUsuario=="admin"){
                //RESOLVER LOGICA ESTO HACE QUE CUANDO 2 CONTACTOS SE LLAMEN IGUAL UNO ABSORBE AL OTRO
                if (!$scope.contenedorMensajes.includes(value.nombre) && !$scope.contenedorMensajes.includes(value.telefono)){
                    $scope.aux.push(value);
                    if(value.nuevoMensaje){
                        var nuevo = {
                           'animation-name': 'latir',
                           'animation-duration': '2s',
                           'animation-iteration-count': 'infinite',
                           'color': '#f7a12f',
                           'telefono': value.telefono,
                       };
                       $scope.notificaciones.push(nuevo);
                       
                   }else{
                       $scope.notificaciones.push("");
                   }
                   
                }
            }
            else if (!$scope.contenedorMensajes.includes(value.nombre) && !$scope.contenedorMensajes.includes(value.telefono) && rangoUsuario === value.rango){
                $scope.aux.push(value);
            }
            
            $scope.contenedorMensajes.push(value.nombre);
            });
            
        var cantidadMsj = $scope.mensajes.length;
            cantidadMsj= cantidadMsj.toString();
            
            if($scope.mensajes.length != $cookies.get('cantidadMensaje') ){
                
                $scope.filtrarMensajes($cookies.get('telefono'), '');
                
                $cookies.put('cantidadMensaje', cantidadMsj);
            }
            // console.log($scope.aux, "aux");
    }
    
        
    $scope.filtrarMensajes = function(telefono, evento, perfil){
        
        if(screen.width<=425){
            $scope.mostrarChat();
        }
        document.getElementById('inpMensaje').focus();
        $scope.chatCliente = [];
        // $scope.mensaje = ""; // resetea el input del chat cuando se hace click en un registro 
        $cookies.put('telefono', telefono);
        var estilo = ""
        var arr = $scope.mensajes;
        var down = "#";
        var nombreMedia = "#";
        $scope.esArchivo = false;
        $scope.esChat = true;
        $scope.urlPerfil = "";
        $scope.nombreCliente="";
        $scope.numeroCliente="";
        $scope.direccionCliente = "";
        $scope.descripcionCliente = "";
        var rangoMensaje = "";
        $scope.urlPerfil = perfil;
        angular.forEach(arr, function(value){
          
        nombreMedia = value.telefono.replace("@c.us","") + value.fecha;
       
        if(telefono === value.telefono){
            $scope.mostrarMenuBotones = false;
            $scope.mostrarMenuCard = true;
            $scope.mostrarEnviarMensaje = true;
            $scope.showDatosDelCliente = true;
    
            
            $scope.telefonoGlobal=telefono;
            $scope.nombreGlobal=value.nombre; 
            if(value.imgurl === ""){
                $scope.mostrarMediaImagen = false;
                $scope.mostrarMediaVideo = false;
                $scope.mostrarMediaAudio = false;
                $scope.mostrarDocumentoDoc = false;
                $scope.mostrarDocumentoXls = false;
                $scope.mostrarDocumentoPdf = false;
                $scope.mostrarDocumentoCsv = false;
                $scope.mostrarPng = false;
                $scope.media = "";
            }
            if(value.estado == 0){ // si el mensaje es de medusa
                rangoMensaje = " - " + value.rangoMensaje;
                $scope.media = "";
                $scope.mostrarMediaImagen = false;
                $scope.mostrarMediaVideo = false;
                $scope.mostrarMediaAudio = false;
                $scope.mostrarDocumentoDoc = false;
                $scope.mostrarDocumentoXls = false;
                $scope.mostrarDocumentoPdf = false;
                $scope.mostrarDocumentoCsv = false;
                $scope.mostrarPng = false;
                if(value.imgurl !== ""){ 
                    $scope.mostrarMediaImagen = false;
                    $scope.mostrarMediaVideo = false;
                    $scope.mostrarMediaAudio = false;
                    $scope.mostrarDocumentoDoc = false;
                    $scope.mostrarDocumentoXls = false;
                    $scope.mostrarDocumentoPdf = false;
                    $scope.mostrarDocumentoCsv = false;
                    $scope.mostrarPng = false;
                    if(value.imgurl.includes(".jpg") || value.imgurl.includes(".jpeg") || value.imgurl.includes(".jfif")){
                        down = "../../../medusa/backend/"+value.imgurl;
                        $scope.img = {
                            'background-image': 'url(../../../medusa/backend/'+value.imgurl+')',
                            'background-repeat': 'no-repeat',
                            'background-size': 'contain',
                            'background-position': 'center',
                            'width': '300px',
                            'height': '300px',
                            'grid-column': '1/ span 2',
                            'grid-row': '1'
                            
                        }
                        if(screen.width<=425){
                            $scope.img = {
                                'background-image': 'url(../../../medusa/backend/'+value.imgurl+')',
                                'background-repeat': 'no-repeat',
                                'background-size': 'contain',
                                'background-position': 'center',
                                'width': '175px',
                                'height': '300px',
                                'grid-column': '1/ span 2',
                                'grid-row': '1'
                                
                            }
                        }
                        value.mensaje = "";
                        $scope.mostrarMediaImagen = true;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarPng = false;
                    }else if(value.imgurl.includes(".mp4")){
                        $scope.mostrarMediaVideo = true;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarPng = false;
                        $scope.media = "../../medusa/backend/"+value.imgurl;
                    }
                    else if(value.imgurl.includes(".wav") || value.imgurl.includes(".mp3")){
                        $scope.mostrarMediaAudio = true;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarPng = false;
                        $scope.media = "../../medusa/backend/"+value.imgurl;
                    }else if(value.imgurl.includes('.doc')){
                        $scope.mostrarDocumentoDoc = true;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarPng = false;
                        down = "../../../medusa/backend/"+value.imgurl;
                        nombreMedia = value.telefono.replace("@c.us","") + value.fecha + value.mensaje;
                        $scope.media = "";
                    }else if(value.imgurl.includes('.xls')){
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = true;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarPng = false;
                        down = "../../../medusa/backend/"+value.imgurl;
                        nombreMedia = value.telefono.replace("@c.us","") + value.fecha + value.mensaje;
                        $scope.media = "";
                    }
                    else if(value.imgurl.includes('.pdf')){
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = true;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarPng = false;
                        down = "../../../medusa/backend/"+value.imgurl;
                        nombreMedia = value.telefono.replace("@c.us","") + value.fecha + value.mensaje;
                        $scope.media = "";
                    }else if(value.imgurl.includes('.csv')){
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = true;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarPng = false;
                        down = "../../../medusa/backend/"+value.imgurl;
                        nombreMedia = value.telefono.replace("@c.us","") + value.fecha + value.mensaje;
                        $scope.media = "";
                    }
                    else if(value.imgurl.includes('.png')){
                        $scope.img = {
                            'background-image': 'url(../../../medusa/backend/'+value.imgurl+')',
                            'background-repeat': 'no-repeat',
                            'background-size': 'contain',
                            'background-position': 'center',
                            'width': '300px',
                            'height': '300px',
                            'grid-column': '1/ span 2',
                            'grid-row': '1'
                        }
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarPng = true;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarMediaAudio = false;
                        down = "../../../medusa/backend/"+value.imgurl;
                        nombreMedia = value.telefono.replace("@c.us","") + value.fecha + value.mensaje;
                        $scope.media = "";
                        value.mensaje = "";
                    }
                    
                }
            }
            if(value.estado==1){// si el mensaje es del cliente
               
                rangoMensaje = "";
                
                if(value.imgurl !== ""){ 
                     
                     
                    $scope.mostrarMediaImagen = false;
                    $scope.mostrarMediaVideo = false;
                    $scope.mostrarMediaAudio = false;
                    $scope.mostrarDocumentoDoc = false;
                    $scope.mostrarDocumentoXls = false;
                    $scope.mostrarDocumentoPdf = false;
                    $scope.mostrarDocumentoCsv = false;
                    $scope.mostrarPng = false;
                    
                    if(value.imgurl.includes(".jpg") || value.imgurl.includes(".jpeg") || value.imgurl.includes(".jfif")){
                        down = "../../../medusa/backend/"+value.imgurl;
                        $scope.img = {
                            'background-image': 'url(../../../medusa/backend/'+value.imgurl+')',
                            'background-repeat': 'no-repeat',
                            'background-size': 'contain',
                            'background-position': 'center',
                            'width': '300px',
                            'height': '300px',
                            'grid-column': '1/ span 2',
                            'grid-row': '1'
                        }
                        if(screen.width<=425){
                            $scope.img = {
                                'background-image': 'url(../../../medusa/backend/'+value.imgurl+')',
                                'background-repeat': 'no-repeat',
                                'background-size': 'contain',
                                'background-position': 'center',
                                'width': '175px',
                                'height': '300px',
                                'grid-column': '1/ span 2',
                                'grid-row': '1'
                                
                            }
                        }
                    value.mensaje = "";
                    $scope.mostrarMediaImagen = true;
                    $scope.mostrarMediaVideo = false;
                    $scope.mostrarMediaAudio = false;
                    $scope.mostrarDocumentoDoc = false;
                    $scope.mostrarDocumentoXls = false;
                    $scope.mostrarDocumentoPdf = false;
                    $scope.mostrarDocumentoCsv = false;
                    $scope.mostrarPng = false;
                    }else if(value.imgurl.includes(".mp4")){
                        $scope.mostrarMediaVideo = true;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarPng = false;
                        $scope.media = "../../medusa/backend/"+value.imgurl;
                    }
                    else if(value.imgurl.includes(".wav") || value.imgurl.includes(".mp3")){
                        $scope.mostrarMediaAudio = true;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarPng = false;
                        $scope.media = "../../medusa/backend/"+value.imgurl;
                    }else if(value.imgurl.includes('.doc')){
                        $scope.mostrarDocumentoDoc = true;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarPng = false;
                        down = "../../../medusa/backend/"+value.imgurl;
                        nombreMedia = value.telefono.replace("@c.us","") + value.fecha + value.mensaje;
                        $scope.media = "";
                    }else if(value.imgurl.includes('.xls')){
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = true;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarPng = false;
                        down = "../../../medusa/backend/"+value.imgurl;
                        nombreMedia = value.telefono.replace("@c.us","") + value.fecha + value.mensaje;
                        $scope.media = "";
                    }
                    else if(value.imgurl.includes('.pdf')){
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = true;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarPng = false;
                        down = "../../../medusa/backend/"+value.imgurl;
                        nombreMedia = value.telefono.replace("@c.us","") + value.fecha + value.mensaje;
                        $scope.media = "";
                    }else if(value.imgurl.includes('.csv')){
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = true;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarPng = false;
                        down = "../../../medusa/backend/"+value.imgurl;
                        nombreMedia = value.telefono.replace("@c.us","") + value.fecha + value.mensaje;
                        $scope.media = "";
                    }
                    else if(value.imgurl.includes('.png')){
                        $scope.img = {
                            'background-image': 'url(../../../medusa/backend/'+value.imgurl+')',
                            'background-repeat': 'no-repeat',
                            'background-size': 'contain',
                            'background-position': 'center',
                            'width': '300px',
                            'height': '300px',
                            'grid-column': '1/ span 2',
                            'grid-row': '1'
                        }
                        $scope.mostrarDocumentoDoc = false;
                        $scope.mostrarDocumentoXls = false;
                        $scope.mostrarDocumentoPdf = false;
                        $scope.mostrarDocumentoCsv = false;
                        $scope.mostrarMediaImagen = false;
                        $scope.mostrarMediaVideo = false;
                        $scope.mostrarMediaAudio = false;
                        $scope.mostrarPng = true;
                        down = "../../../medusa/backend/"+value.imgurl;
                        nombreMedia = value.telefono.replace("@c.us","") + value.fecha + value.mensaje;
                        $scope.media = "";
                        value.mensaje = "";
                    }
                }
                estilo = $scope.mensajeStyleCliente;
               
                
            $scope.descripcionCliente = value.descripcion;
            $scope.direccionCliente = value.direccion;
                    
            $scope.nombreCliente = "Conversación con: "+value.nombre;
            $scope.nombreClienteCard = value.nombre;
            $scope.numeroClienteImagen=value.telefono;
            $scope.numeroCliente=value.telefono.replace("@c.us","");
            }
            else{
                
                if(value.esContacto){
                    
                   
                    
                    $scope.descripcionCliente = value.descripcion;
                    $scope.direccionCliente = value.direccion;
                    
                }else{
                    $scope.mostraGuardarDatosCliente = true;
                    $scope.mostraModificarDatosCliente = false;
                }
                $scope.nombreCliente = "Conversación con: "+value.nombre;
                $scope.nombreClienteCard = value.nombre;
                $scope.numeroClienteImagen=value.telefono;
                $scope.numeroCliente=value.telefono.replace("@c.us","");
                estilo = $scope.mensajeStyleMedusa;
            }
           
            if(value.rango === undefined){
               
                rangoMensaje = " nuevo rango "
            }
           
            var jsonMensajeCliente = {
                "mensaje":value.mensaje,
                "fecha": value.fecha,
                "estado":value.estado,
                "estilo": estilo,
                'media': $scope.media,
                'img': $scope.img,
                'mostrarMediaImagen': $scope.mostrarMediaImagen,
                'mostrarMediaVideo': $scope.mostrarMediaVideo,
                'mostrarMediaAudio': $scope.mostrarMediaAudio,
                'mostrarDocumentoDoc': $scope.mostrarDocumentoDoc,
                'mostrarDocumentoXls': $scope.mostrarDocumentoXls,
                'mostrarDocumentoPdf': $scope.mostrarDocumentoPdf,
                'mostrarDocumentoCsv': $scope.mostrarDocumentoCsv,
                'mostrarPng': $scope.mostrarPng,
                'download':  down,
                'nombreMedia': nombreMedia,
                'rango': rangoMensaje,
                'nombreUsuario': value.nombreUsuario
            }
            $scope.chatCliente.push(jsonMensajeCliente);
            $scope.idContactoSeleccionado = $scope.contactosId.filter(item => {
                return item.telefono === value.telefono; // Filtrar los elementos que no sean 'medusa'
              }).map(item2 => {
                return item2.idContacto; // Obtener solo el ... de cada elemento
              });
         
            $cookies.put('ticket', $scope.idContactoSeleccionado);
        }
        
        });
        
        
        if(evento === "click"){ 
            
            
            $scope.fotoPerfil = {
              
                'background-position': 'center',
                'border-radius': '40px',
                'width': '50px',
                'height': '50px'
            }
            
            $scope.fotoPerfilCard = {
              
                'background-position': 'center',
                'border-radius': '60px',
                'width': '120px',
                'height': '120px',
                'margin': '2% auto'
            }
         
          
            angular.forEach($scope.notificaciones, function(value, $index){
                if(value.telefono===telefono){
                    $scope.notificaciones[$index] = "";
                    
                }
            });
        }
        $timeout(function(){
            $scope.scrollToBottom();
        },0.8);
        $scope.chatCliente.reverse();
        $scope.chatClienteAux = $scope.chatCliente;
    }
    
    $scope.difusion=function(mens){
    $http.post(hostWeb+":8081/difundir",
        {
            'mensaje': mens
        });
    }
    
    $scope.enviarMensaje= function(event){
      
        var envia = "";
        var url = "";
        var fecha = new Date();
        var fechaString = $filter('date')(fecha, 'dd/MM/yyyy - HH:mm:ss');
        var fechaStringBuscar = $filter('date')(fecha, 'dd-MM-yyyy');
        if((event.key == "Enter" || event.type == "click") && $scope.mensaje !=""){
            //resetea el input chat  
         
        if($scope.esArchivo){
            envia = true;
            url = $scope.mensaje;
        }else{
            envia = false;
        }
            var mensaje= $scope.mensaje;
           
            mensaje = mensaje.replace(/'/g, "");
            mensaje = mensaje.replace(/"/g, "");
            mensaje = mensaje.replace(/\\/g, "");
        socket.emit('enviarMensaje', mensaje)
        $http.post(hostWeb+':8081/chat/mensajeMedusa',
        {
            'nombre': $scope.nombreGlobal,
            'telefono':$scope.telefonoGlobal.replace('+',''),
            'from': $scope.telefonoGlobal.replace('+',''),
            'fecha':fechaString,
            'fechaBuscar': fechaStringBuscar,
            'mensaje': mensaje,
            'dispositivo':"bot",
            'imgurl': url,
            'estado':0,
            'bool':false,
            'rango': $scope.rangoActual,
            'enviaArchivo': envia,
            'nombreUsuario': $scope.nombreUsuarioCookie
            
        }).success(function(value){
            $scope.mensaje = "";
            // console.log(value);
            // console.log("envia el mensaje");
        });
        
    }}
    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      } 
    $scope.mensajeClienteActivo = function(mensaje, nombre, telefono){
        console.log("enviar mensaje cliente activo");
        var fecha = new Date();
        var fechaString = $filter('date')(fecha, 'dd/MM/yyyy - HH:mm:ss');
        
        $http.post(hostWeb+':8081/chat/mensajeMedusa',
        {
            'nombre': nombre,
            'telefono':telefono,
            'fecha':fechaString,
            'mensaje':mensaje,
            'dispositivo':"bot",
            'imgurl': '',
            'estado': 2,
            'bool':false,
            'rango': "medusa",
            'attachmentData': $scope.attachmentData,
            'nombreUsuario':"medusa"
           
        }).success(function(response){
          if(response){
           
          }
        }).finally(function(){
         
        });
        
    }
    
    $scope.cerrarChat= function(){
        let telefono = $scope.clienteSeleccionadoCambiarRango.telefono;
        $http.post(hostWeb+':8081/chat/cerrarChat',
        {
           'telefono':telefono,
           
        }).success(function(response){
          if(response){
          
          }
        });
        
    }
    
    
    
    
    // funcion para enviar archivos 
    $scope.url="";
    
    $scope.SelectFile=function(e){
        $scope.mensaje = "";
        $scope.host = "";
        $scope.attachmentData = "";
        $scope.estiloArchivo = {};
        $scope.urlArchivo = "";
      
       let file = document.getElementById("imgDer").files[0];
       const reader = new FileReader();
       reader.readAsDataURL(file);
        $scope.mensaje = file.name;
        $scope.mensaje = $scope.mensaje.replace(/ /g, "");
        // data:image/jpeg;base64,
        
        reader.addEventListener('load', (event) => {
            $scope.attachmentData = "";
          
            $scope.esArchivo=true;
            $scope.esChat=false;
            $scope.attachmentData = event.target.result;
    
            
            let host = "./subir/";
        
            $scope.attachmentData= $scope.attachmentData.replace("data:image/jpg;base64,","");
            $scope.attachmentData= $scope.attachmentData.replace("data:image/png;base64,","");
            $scope.attachmentData= $scope.attachmentData.replace("data:image/jpeg;base64,",""); // despues poner un if, para controlar todos los tipos de archivos y hacerle el replace
            $scope.attachmentData = $scope.attachmentData.replace("data:application/pdf;base64,","");
            $scope.attachmentData = $scope.attachmentData.replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,","");
            $scope.attachmentData = $scope.attachmentData.replace("data:audio/wav;base64,","");
            $scope.attachmentData = $scope.attachmentData.replace("data:audio/mpeg;base64,","");
            $scope.urlArchivo=host+$scope.mensaje; 
            $timeout(() => {
                $scope.estiloArchivo = {
                    'background-image': 'url(../../../medusa/backend/subir/'+$scope.mensaje+')',
                    'background-position': 'center',
                    'background-repeat': 'no-repeat',
                    'background-size': 'contain',
                    'height': '70vh',
                    'width': '400px',
                    'margin-left': 'auto',
                    'margin-right': 'auto'
                }
            },1000)
            
            document.getElementById('inpMensaje').focus()
            $http.post(hostWeb+':8081/chat/guardar', 
            {
               'archivo': $scope.attachmentData, //archivo en base 64
               'ruta': host, // carpeta donde se va a guardar
               'nombre': $scope.mensaje // nombre del archivo
            }).success(function(response){
                $scope.attachmentData = "";
                host = "";
                $scope.mensaje = "";
            });
        });
    }

    $scope.editarContacto=function(){
        // console.log($scope.descripcionCliente);
        // console.log($cookies.get('ticket')) // tiene el id del contacto seleccionado cuando se hace click en la caja de registro
        // console.log($scope.numeroCliente)
        $http.post(hostWeb+':8081/contacto/editarContacto',
        {
            'idContacto': $scope.idContactoSeleccionado[0],
            'telefono':$scope.numeroCliente+'@c.us',
            'nombre': $scope.nombreClienteCard,
            'conexion':'',
            'nombreCompuesto':$scope.nombreClienteCard,
            'descripcion': $scope.descripcionCliente,
            'direccion': $scope.direccionCliente,
            'urlPerfil': $scope.urlPerfil
           
        }).success(function(response){
            // console.log("editar Contacto");
            // console.log(response);
          if(response){
            alerta('Se editó el contacto exitosamente!', 'warning');
            
            getContactosCallBack((response) => {
                $scope.iniciarApp(true, $scope.datosRecibidos, response);
                // console.log("inicia app");
            })
                
            
          }
        });
    }


    ///MANIPULACION DE DOM

 
    //hacer que el elemento con id 'chat' tenga el scroll siempre al final
    $scope.scrollToBottom = function() {
        var chat = document.getElementById("chatt");
        chat.scrollTop = chat.scrollHeight;
    }
    $scope.irADifusion = function(){
        $window.location.href = hostWeb+"/medusa/frontend/difundir.html";
    }
    $scope.irAEstadisticas = function(){
        $window.location.href = hostWeb+"/medusa/frontend/estadisticas.html";
    }
    $scope.irATickets = function(){
        $window.location.href = hostWeb+"/medusa/frontend/tickets.html";
    }
    $scope.irATicketsContacto = function(){
        $window.open(hostWeb+"/medusa/frontend/tickets.html", "_blank");
       
    }
    
    $scope.irAContactos = function(){
        $window.location.href = hostWeb+"/medusa/frontend/contactos.html";
    }
    
    $scope.irAEmail = function(){
        $window.location.href = hostWeb+"/medusa/frontend/email.html";
    }


    $scope.mostrarChat=function(){
        $scope.chatMensaje=true;
        $scope.registroMensaje=false;
    }

    $scope.mensajeStyleCliente = {
        'border-radius': '0px 19px 19px 19px',
        'background-color': 'rgba(255, 255, 255)',
        'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        'padding': '2% 2%',
        'color': 'black',
        'font-size': '17px',
        'font-family': 'Roboto, sans-serif',
        // 'font-weight': 'bold',
        'justify-self': 'start',
        'align-self': 'center',
        'margin-left' : '12%',
        'grid-column': '1',
        // 'min-width': '60%',
        'max-width': '90%',
    }
    
    $scope.mensajeStyleMedusa = {
        'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        'border-radius': '19px 19px 0px 19px',
        'background-color': '#c4e1f4',
        'padding': '2% 2%',
        'color': 'black',
        'font-size': '17px',
        'font-family': 'Roboto, sans-serif',
        // 'font-weight': 'bold',
        'justify-self': 'center',
        'align-self': 'center',
        'margin-left' : 'auto',
        'margin-right': '5%',
        'grid-column': '1 / span 2',
        'max-width': '46%',
        // 'min-width': '25%',
       
    }
    
    function alerta(mensaje,status) {
        SnackBar({
            message: mensaje,
            dismissible: true,
            status: status,
            timeout: 25000,
            position: 'tr'
        });
        return false;
    }
    
    //BUSCADOR DE CONTACTOS
    $scope.buscarContacto = (contacto) => { 
        if(contacto !== undefined){//evento.keyCode === 13 && 
          $scope.objContactos = []; // Vaciar el arreglo antes de cada búsqueda
          angular.forEach($scope.arContactos, value => {
            const campos = ['idContacto', 'nombre', 'telefono', 'descripcion', 'direccion', 'producto'];
            campos.forEach(campo => {
              if (value[campo] && value[campo].toString().toLowerCase().includes(contacto.toLowerCase())) {
                // Usar push para agregar los contactos encontrados al arreglo
                
                $scope.objContactos.push(value);
              }
            });
          });
       
        }
    }
        
    $scope.imagenNoCargada = (elementoImg) =>{
        elementoImg.src = './style/perfilVacio.png'; // Puedes establecer una imagen predeterminada
        elementoImg.alt = 'Error al cargar la imagen';
    }
  
    $scope.mostrarMenu = ()=>{
        $scope.chatCliente = [];
        $scope.nombreCliente = "";
        $scope.nombreClienteCard = "";
        $scope.numeroClienteImagen= "";
        $scope.numeroCliente= "";
        $scope.fotoPerfil = "";
        $scope.showDatosDelCliente = false;
        $scope.mostrarEnviarMensaje = false;
        $scope.mostrarMenuBotones = true;
        $scope.mostrarMenuCard = false;
    }
    
    });