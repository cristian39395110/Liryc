bot.controller("ticketController", function($window, $scope, $http, $cookies,$filter,$timeout, $rootScope, $interval, hostValue){
$scope.mostrarMisTickets = false;
$scope.mostrarCrearTicket = true;
$scope.mostrarTicketcerrado = false;
$scope.mostrarTicketAbierto = false;
$scope.mostrarTicketProceso = false;
$scope.desactivarGuardar = true;
$scope.mensajeBtnGuardar = "Antes de guardar debes buscar un contacto";
$scope.contactoTarjeta = {};
$scope.nombreUsuarioCookie = $cookies.get('usuario');

const rangoUsuario = $cookies.get('rango');
$scope.rangoActual = rangoUsuario;
$scope.categorias = ['Facturacion', 'Cobranza', 'Servicio tecnico', 'Ventas', 'Solicitar turno', 'Cancelar turno', 'Reprogramar turno'];
$scope.btnGuardarTicket = "btn-success";

const hostWeb = hostValue;

/**
 * Función que inicia la aplicación llamando a otras funciones para obtener datos de contacto, áreas y operadores.
 * @function iniciarApp
 * @returns {void}
 */
$scope.iniciarApp = () =>{
    checkLogin();
    getContacto();
    getAreas();
    getOperadores();
    getTickets();
    getTicketsPorOperador();
    getTicketsAsignadosPorOperador();
    getTicketsAsignadosPorOperadorAbiertos();
    getTicketsAsignadosPorOperadorCerrados();
    getTicketsAsignadosPorOperadorProceso();
    $timeout(() =>{
        $scope.mostrarContacto(Number($cookies.get('ticket')));
        console.log($cookies.get('ticket'))
    },500)
    
}

function checkLogin(){
    if(rangoUsuario == undefined){
        $window.location.href = hostWeb+"/sidelink/frontend/login.html";
    }
}

/**
 * Función que maneja la navegación del menú.
 * @function navMenu
 * @param {string} menu - El nombre del menú seleccionado.
 * @returns {void}
 */
$scope.navMenu = function(menu){
    if(menu === 'chat'){
        $window.location.href = hostWeb+'/sidelink/frontend/';
    }else if(menu === 'crear' && $scope.mostrarCrearTicket == false){
        $scope.tituloTickets = " - Crear Ticket";
        $scope.mostrarMisTickets = false;
        $scope.mostrarCrearTicket = true;
        $scope.mostrarTicketcerrado = false;
        $scope.mostrarTicketAbierto = false;
        $scope.mostrarTicketProceso = false;
    }else if(menu === 'mis' && $scope.mostrarMisTickets == false){
        $scope.tituloTickets = " - Mis Tickets";
        $scope.mostrarMisTickets = true;
        $scope.mostrarCrearTicket = false;
        $scope.mostrarTicketcerrado = false;
        $scope.mostrarTicketAbierto = false;
        $scope.mostrarTicketProceso = false;
    }else if(menu === 'abierto' && $scope.mostrarTicketAbierto == false){
        $scope.tituloTickets = " - Tickets Abiertos";
        $scope.mostrarMisTickets = false;
        $scope.mostrarCrearTicket = false;
        $scope.mostrarTicketcerrado = false;
        $scope.mostrarTicketAbierto = true;
        $scope.mostrarTicketProceso = false;
    }else if(menu === 'enProceso' && $scope.mostrarTicketProceso == false){
        $scope.tituloTickets = " - Ticket en proceso";
        $scope.mostrarMisTickets = false;
        $scope.mostrarCrearTicket = false;
        $scope.mostrarTicketcerrado = false;
        $scope.mostrarTicketAbierto = false;
        $scope.mostrarTicketProceso = true;
    }else if(menu === 'cerrado' && $scope.mostrarTicketcerrado == false){
        $scope.tituloTickets = " - Ticket Cerrados";
        $scope.mostrarMisTickets = false;
        $scope.mostrarCrearTicket = false;
        $scope.mostrarTicketcerrado = true;
        $scope.mostrarTicketAbierto = false;
        $scope.mostrarTicketProceso = false;
    }
}

/**
 * Función que obtiene los contactos mediante una petición HTTP GET.
 * @function getContacto
 * @returns {$scope.getContacto}
 */
const getContacto = () =>{
    $http.get(hostWeb+':8081/contacto/getContactos')
        .then((response)=>{
            $scope.getContacto = response.data;
            $scope.objContactos = $scope.getContacto.slice(-10);
            // console.log($scope.getContacto);
        });
}

/**
 * Función que obtiene las áreas mediante una petición HTTP GET.
 * @function getAreas
 * @returns {$scope.getAreas}
 */
const getAreas = () => {
    // Hace una petición HTTP GET a la URL específica usando el servicio $http
    $http.get(hostWeb+':8081/tickets/areas')
        .then((response) => {
            // En caso de que la petición sea exitosa, maneja la respuesta
            // asignándola a la variable $scope.getAreas
            $scope.getAreas = response.data;
            // Imprime la respuesta en la consola para fines de depuración
            // console.log($scope.getAreas);
        });
}

const getOperadores = () => {
    $http.get(hostWeb + ':8081/chat/empleados')
      .then((response) => {
        $scope.getOperadores = response.data.filter(value => {
          return value.nombre !== 'medusa'; // Filtrar los elementos que no sean 'medusa'
        }).map(value => {
          return value.nombre; // Obtener solo el nombre de cada elemento
        });
        // console.log($scope.getOperadores);
      });
}

const getTickets = () => {
    // $http.get(hostWeb + ':8081/tickets/ticket')
    //   .then((response) => {
    //     $scope.getTickets = response.data;
    //     console.log($scope.getTickets);
    //   });
      $http.post('http://132.255.224.147:8081/chat/verTicket',{documento: 36046703})
      .then((response) => {
        $scope.getTickets = response.data;
        console.log($scope.getTickets);
      });
}

const getTicketsPorOperador = () => {
    $http.post(hostWeb + ':8081/tickets/ticketsOperador',
    {
        'usuario': $scope.nombreUsuarioCookie
    }
    ).then((response) => {
        $scope.getTicketsPorOperador = response.data;
        // console.log($scope.getTicketsPorOperador, 'getTicketsPorOperador');
      });
}

const getTicketsAsignadosPorOperador = () => {
    $http.post(hostWeb + ':8081/tickets/ticketAsignadosPorOperador',
    {
        'usuario': $scope.nombreUsuarioCookie
    }
    ).then((response) => {
        $scope.getTicketsAsignadosPorOperador = response.data;
        // console.log($scope.getTicketsAsignadosPorOperador, 'getTicketsASignados');
      });
}

const getTicketsAsignadosPorOperadorAbiertos = () => {
    $http.post(hostWeb + ':8081/tickets/ticketAsignadosPorOperadorAbiertos',
    {
        'usuario': $scope.nombreUsuarioCookie
    }
    ).then((response) => {
        $scope.getTicketsAsignadosPorOperadorAbiertos = response.data;
        // console.log($scope.getTicketsAsignadosPorOperadorAbiertos, 'getTicketsASignados');
      });
}

const getTicketsAsignadosPorOperadorProceso = () => {
    $http.post(hostWeb + ':8081/tickets/ticketAsignadosPorOperadorProceso',
    {
        'usuario': $scope.nombreUsuarioCookie
    }
    ).then((response) => {
        $scope.getTicketsAsignadosPorOperadorProceso = response.data;
        // console.log($scope.getTicketsAsignadosPorOperadorProceso, 'getTicketsASignados');
      });
}

const getTicketsAsignadosPorOperadorCerrados = () => {
    $http.post(hostWeb + ':8081/tickets/ticketAsignadosPorOperadorCerrados',
    {
        'usuario': $scope.nombreUsuarioCookie
    }
    ).then((response) => {
        $scope.getTicketsAsignadosPorOperadorCerrados = response.data;
        // console.log($scope.getTicketsAsignadosPorOperadorCerrados, 'getTicketsASignados');
      });
}

function obtenerFechaActual() {
    // Obtener la fecha actual
    const fechaActual = new Date();
  
    // Obtener el día, mes y año de la fecha actual
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript comienzan desde 0 (enero = 0)
    const anio = fechaActual.getFullYear();
  
    // Formatear la fecha en el formato "dd/mm/yyyy"
    const fechaFormateada = `${dia < 10 ? '0' : ''}${dia}/${mes < 10 ? '0' : ''}${mes}/${anio}`;
  
    // Retornar la fecha formateada
    return fechaFormateada;
  }

$scope.deleteTicket = async () => {
try {
    const confirmacion = await confirmCustom("¿Estás seguro de que deseas eliminar este ticket?", "danger");
    if (confirmacion) {
    $http.post(hostWeb + ':8081/tickets/deleteTickets',
        {
            'idTicket': $scope.idTicketSeleccionado
        }
        ).then((response) => {
            if(response){
                alerta('Ticket eliminado', 'danger');
                getTickets();
                getTicketsPorOperador();
                getTicketsAsignadosPorOperador();
                $timeout(()=>{
                    $scope.mostrarContacto($scope.idContactoSeleccionado);
                },500)
            }
            
        });
    }
}catch (error) {
    if (error === "Cancelado") {
      // El usuario ha cancelado la acción
    }
  }
}

$scope.insertTicket = (idContacto, area, asignado, categoria, estado, descripcionTicket) => {
    // console.log(idContacto, area, asignado, categoria, estado, descripcionTicket);
    var route = "";
    let fechaActual = obtenerFechaActual();
    let fechaCierre = "";
    let fechaProceso = "";
    $scope.ticketsAsignados = $scope.ticketsAsignados;
    if(estado === "cerrado"){
        fechaCierre = fechaActual;
    }else if(estado === 'en proceso'){
        fechaProceso = fechaActual;
    }
    if(idContacto !== undefined){
        if (area === "" || asignado === "" || categoria === "" || estado === "" || descripcionTicket === "") {
            // Manejar el caso en el que alguno de los parámetros sea undefined
            console.error('Alguno de los parámetros es undefined.');
            alerta('Falta completar un campo', 'danger');
        }else{  // Manejar el caso en el que ninguno de los parámetros sea undefined
            if($scope.mensajeBtnGuardar === "Guardar"){ //si el boton es "Guardar llama a insertTicket"
                route = "tickets/insertTicket";
            }else{ //si no, es "actualizar" y llama a updateTicket
                route = "tickets/updateTicket"
                fechaActual = $scope.fechaCreacionTkActual;
            }
                $http.post(hostWeb+':8081/'+route,
                    {
                        'idTicket' : $scope.idTicketSeleccionado,
                        'idContacto': idContacto,
                        'categoria': categoria,
                        'asignado': asignado,
                        'descripcion': descripcionTicket,
                        'estado': estado,
                        'prioridad': '',
                        'comentario': '',
                        'usuario': $scope.nombreUsuarioCookie,
                        'fechaCreacion': fechaActual,
                        'fechaProceso': fechaProceso,
                        'area': area,
                        'fechaCierre': fechaCierre
                    }
                    ).then((response) => {
                        if(response){
                            // console.log("ticket agregado");
                            $scope.area = "";
                            $scope.asignar = "";
                            $scope.categoria = "";
                            $scope.estado = "";
                            $scope.descripcionTicket = "";
                            alerta('Guardado correctamente', 'success');
                            getTickets();
                            getTicketsPorOperador();
                            getTicketsAsignadosPorOperador();
                            getTicketsAsignadosPorOperadorAbiertos();
                            getTicketsAsignadosPorOperadorCerrados();
                            getTicketsAsignadosPorOperadorProceso();
                            $timeout(()=>{
                                $scope.mostrarContacto($scope.idContactoSeleccionado);
                            },500)
                            
                        }else{
                            // console.log("error al agregar ticket");
                        }
                            
                    });
            
            
        }
    }else{
        alerta('Primero debes seleccionar un contacto', 'danger');
    }
   
   
}

$scope.buscarContacto = (contacto) => { 
    if(contacto !== undefined){//evento.keyCode === 13 && 
      $scope.objContactos = []; // Vaciar el arreglo antes de cada búsqueda
      angular.forEach($scope.getContacto, value => {
        const campos = ['idContacto', 'nombre', 'telefono', 'descripcion', 'direccion', 'producto'];
        campos.forEach(campo => {
          if (value[campo] && value[campo].toString().toLowerCase().includes(contacto.toLowerCase())) {
            // Usar push para agregar los contactos encontrados al arreglo
            $scope.objContactos.push(value);
          }
        });
      });
    //   console.log($scope.objContactos);
    }
}
  
// $scope.mostrarContacto = (idContacto)=> {
//     $scope.desactivarGuardar = false;
//     $scope.mensajeBtnGuardar = "Guardar";

//     $scope.contactoTarjeta = [];
//     $scope.contactoTarjeta = $scope.getContacto.filter(value => {
//         return value.idContacto === idContacto;
//     });
    // console.log($scope.contactoTarjeta);
// }

$scope.mostrarContacto = (idContacto)=> {
    console.log(idContacto);
    
        $scope.idContactoSeleccionado = idContacto;
        $scope.contactoTarjeta = $scope.getContacto.filter(value => {
          return value.idContacto === idContacto;
        });
        $scope.fotoPerfilCard = $scope.contactoTarjeta[0].urlPerfil;
        // {
        //     'background-image': 'url('+$scope.contactoTarjeta[0].urlPerfil+')',
        //     'background-repeat': 'no-repeat',
        //     'background-size': 'contain',
        //     'background-position': 'center',
        // }
        
        // Obtener los tickets asignados al contacto seleccionado
        $scope.ticketsAsignados = $scope.getTickets.filter(ticket => {
          return ticket.idContacto === idContacto; // Nombre del contacto obtenido del filtro anterior
        });
        // console.log($scope.ticketsAsignados, "ticketsAsignados");

    if($scope.contactoTarjeta[0] !== undefined){
        $scope.desactivarGuardar = false;
        $scope.mensajeBtnGuardar = "Guardar";
        $scope.btnGuardarTicket = "btn-success";
    }
}
  

$scope.seleccionarTicket = function(ticket, modulo) {
    // Actualizar los modelos con los valores del ticket seleccionado}
    $timeout(()=>{
        $scope.mensajeBtnGuardar = "Actualizar";
        $scope.btnGuardarTicket = "btn-warning";
    }); 
    
    if(modulo === 'misTickets'){
        $scope.mostrarTicketcerrado = false;
        $scope.mostrarTicketAbierto = false;
        $scope.mostrarTicketProceso = false;
        $scope.mostrarMisTickets = false;
        $scope.mostrarCrearTicket = true;
        $scope.idTicketSeleccionado = ticket.idTicket;
        $scope.area = ticket.area;
        $scope.asignar = ticket.asignado;
        $scope.categoria = ticket.categoria;
        $scope.estado = ticket.estado;
        $scope.descripcionTicket = ticket.descripcionTicket;
        
        $scope.mostrarContacto(ticket.idContacto);
        $timeout(()=>{//selecciona el item del acordeon a abrir basado en el idticket y le agrega la clase show para desplegarlo
            const accordion = document.getElementById('panelsStay-collapse'+ticket.idTicket); 
            accordion.classList.add('show');
        });
        
    }else{
        $scope.fechaCreacionTkActual = ticket.fechaCreacion; //guardo la fecha, por si se actualiza para mantener la misma fecha.
        $scope.idTicketSeleccionado = ticket.idTicket;
        $scope.area = ticket.area;
        $scope.asignar = ticket.asignado;
        $scope.categoria = ticket.categoria;
        $scope.estado = ticket.estado;
        $scope.descripcionTicket = ticket.descripcionTicket;
    }
    
}


$scope.nuevoTicket = ()=>{
    $scope.desactivarGuardar = false;
    $scope.area = "";
    $scope.asignar = "";
    $scope.categoria = "";
    $scope.estado = "";
    $scope.descripcionTicket = "";
    $scope.mensajeBtnGuardar = "Guardar";
    $scope.btnGuardarTicket = "btn-success";
}



function alerta(mensaje,status) {
    SnackBar({
        message: mensaje,
        dismissible: true,
        status: status,
        timeout: 8000,
        position: 'tr'
    });
    return false;
  }
  
  async function confirmCustom(mensaje, status) {
    return new Promise((resolve, reject) => {
      SnackBar({
        message: mensaje,
        dismissible: true,
        status: status,
        timeout: 8000,
        position: "tr", // Posición inferior y centrada
        onClose: () => {
          reject("Cancelado");
        },
        actions: [
          {
            text: 'Aceptar',
            function: function() {
              resolve(true);
            },
            dismiss: true, // Indica que se debe cerrar el Snackbar después de hacer clic en "Aceptar"
          },
          {
            text: 'Cancelar',
            function: function() {
              resolve(false);
            },
            dismiss: true, // Indica que se debe cerrar el Snackbar después de hacer clic en "Cancelar"
          }
        ],
      });
    });
  }
  
  $scope.imagenNoCargada = (elementoImg) =>{
    elementoImg.src = './style/perfilVacio.png'; // Puedes establecer una imagen predeterminada
    elementoImg.alt = 'Error al cargar la imagen';
}

});