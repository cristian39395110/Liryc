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
$scope.categorias = [];
$scope.getEstados = [];
$scope.getAreas = [];
const rangoUsuario = $cookies.get('rango');
$scope.rangoActual = rangoUsuario;
$scope.spinnerTicket = true;
// $scope.categorias = ['Facturacion', 'Cobranza', 'Servicio tecnico', 'Ventas', 'Solicitar turno', 'Cancelar turno', 'Reprogramar turno'];
$http.get('http://172.19.3.85:5001/getCategoriaTickets').then((response) => {
   
    response.data.forEach(element => {
        $scope.categorias.push(element)     
    });
});
$http.get('http://172.19.3.85:5001/estadoTickets').then((response) => {
    response.data.forEach(element => {
        $scope.getEstados.push(element)
    });
});
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
    // $http.get(hostWeb+':8081/tickets/areas')
    //     .then((response) => {
    //         // En caso de que la petición sea exitosa, maneja la respuesta
    //         // asignándola a la variable $scope.getAreas
    //         $scope.getAreas = response.data;
    //         // Imprime la respuesta en la consola para fines de depuración
    //         // console.log($scope.getAreas);
    //     });
        $http.get('http://172.19.3.85:5001/areasTickets')
        .then((response) => {
         
            response.data.forEach(element => {
                $scope.getAreas.push(element)
            });
            
        });
}

const getOperadores = () => {
    // $http.get('http://172.19.3.85:5001/getOperadores')
    //   .then((response) => {
    //     $scope.getOperadores = response.data.filter(value => {
    //       return value.nombre !== 'medusa'; // Filtrar los elementos que no sean 'medusa'
    //     }).map(value => {
    //       return value.nombre; // Obtener solo el nombre de cada elemento
    //     });
    //      console.log($scope.getOperadores);
    //   });
      $http.get(hostWeb + ':8081/chat/empleados')
      .then((response) => {
        $scope.getOperadores = response.data.filter(value => {
          return value.nombre !== 'medusa'; // Filtrar los elementos que no sean 'medusa'
        })
        // console.log($scope.getOperadores);
      });
}

const getTickets = () => {
    // $http.get(hostWeb + ':8081/tickets/ticket')
    //   .then((response) => {
    //     $scope.getTickets = response.data;
    //     console.log($scope.getTickets);
    //   });
    
      $http.post('http://172.19.3.85:5001/verTicket',{documento: $cookies.get('dniTicket')})
      .then((response) => {
        $scope.getTickets = response.data;
        
        if($scope.getTickets.message === 'Ticket no encontrado'){
            // console.log("netro afa")
            $scope.spinnerTicket = true;
alerta(
`No se han encontrado tickets.
Por favor revise el dni del contacto o si tiene tickets creados.`,
 'warning');
        }else{
            // console.log($scope.getTickets.message === 'Ticket no encontrado');
        $scope.mostrarContacto(Number($cookies.get('ticket')));
        // console.log($cookies.get('ticket'), 'cookie ticket')
            $scope.spinnerTicket = false;
        }
        
      });
      $http.post('http://172.19.3.85:5001/verConexion',{documento: $cookies.get('dniTicket')})
      .then((response) => {
        $scope.getConexion = response.data.map((item) => {
            return {idConexion: item.id, nombre: item.plan.name}
        });
        // console.log($scope.getConexion);
      });
}

const getTicketsBuscar = async (dni) => {
    $scope.spinnerTicket = true;
    // $http.get(hostWeb + ':8081/tickets/ticket')
    //   .then((response) => {
    //     $scope.getTickets = response.data;
    //     console.log($scope.getTickets);
    //   });
    $scope.getTickets = [];
      await $http.post('http://172.19.3.85:5001/verTicket',{documento: dni})
      .then((response) => {
         $scope.getTickets = response.data;
        // console.log($scope.getTickets);
        $scope.customer_id = $scope.getTickets[0].customer_id
        // console.log($scope.customer_id);
        if($scope.getTickets.message === 'Ticket no encontrado'){
            $scope.spinnerTicket = true;
alerta(
`No se han encontrado tickets.
Por favor revise el dni del contacto o si tiene tickets creados.`,
'warning');
        }else{
            $scope.spinnerTicket = false;
        }
      });
      $http.post('http://172.19.3.85:5001/verConexion',{documento: dni})
      .then((response) => {
        $scope.getConexion = response.data.map((item) => {
            return {idConexion: item.id, nombre: item.plan.name}
        });
        // console.log($scope.getConexion);
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

$scope.insertTicket = (area, categoria, estado, asignar, idConexion, descripcionTicket,idTicketSeleccionado) => {
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
    if(true){ //idTicketSeleccionado !== undefined
        if ( asignar === "" || categoria === "" || estado === "") {//tuve que sacar el area porque ispcube no lo incluye en la api como una variable ***** consultar con martin********   area === "" ||
            // Manejar el caso en el que alguno de los parámetros sea undefined
            console.error('Alguno de los parámetros es undefined.');
            alerta('Falta completar un campo', 'danger');
        }else{  // Manejar el caso en el que ninguno de los parámetros sea undefined
            if($scope.mensajeBtnGuardar === "Guardar"){ //si el boton es "Guardar llama a insertTicket"
                route = "insertTicket";
            }else{ //si no, es "actualizar" y llama a updateTicket
                route = "updateTicket"
                fechaActual = $scope.fechaCreacionTkActual;
            }
            // {
            // "ticket_area_id":1,
            // "ticket_category_id":1,
            // "ticket_priority_id":3,
            // "ticket_status_id":1,
            // "assigned_user_id":1,
            // "connection_id":1,
            // "price":1500,
            // "visit_date":"2023-05-26",
            // "visit_time_start":"2023-05-26",
            // "visit_time_end":"2023-05-26",
            // "new_item_content":"Estuvimos trabajando en el problema",
            // "new_internal_item_content":"Estuvimos trabajando en el problema",
            // "files":[{"base64":"base64string"}]
            // }
            // console.log('antes del insert',
            //            {
            //             ticket_area_id: $scope.getAreas.find(item => area === item.name).id,
            //             ticket_category_id: $scope.categorias.find(item => categoria === item.name).id,
            //             ticket_status_id: $scope.getEstados.find(item => estado === item.name).id,
            //             connection_id: idConexion,
            //             new_internal_item_content: descripcionTicket,
            //             idticket: idTicketSeleccionado,
            //             assigned_user_id: Number($scope.getOperadores.find(item => asignar === item.nombre).telefono),
            //            }
            //         )
                $http.post('http://172.19.3.85:5001/'+route,
                    {
                        'ticket_area_id': $scope.getAreas.find(item => area === item.name).id,
                        'ticket_category_id': $scope.categorias.find(item => categoria === item.name).id,
                        'ticket_status_id': $scope.getEstados.find(item => estado === item.name).id,
                        'connection_id': idConexion,
                        'internal_item_content': descripcionTicket,
                        'item_content': 'Estuvimos trabajando en el problema',
                        'new_internal_item_content': descripcionTicket,
                        'idticket': idTicketSeleccionado,
                        'assigned_user_id': Number($scope.getOperadores.find(item => asignar === item.nombre).telefono),
                        'customer_id': $scope.customer_id,
                    }
                    ).then((response) => {
                        console.log(response);
                        if(response.data.message === "Ticket Actualizado" || response.data.message === "Ticket creado."){
                            // console.log("ticket agregado");
                            $scope.area = "";
                            $scope.asignar = "";
                            $scope.categoria = "";
                            $scope.estado = "";
                            $scope.descripcionTicket = "";
                            $scope.idConexion = "";
                           $scope.historialTicket = "";
                            $timeout(()=>{
                                alerta('Guardado correctamente', 'success');
                                
                                getTicketsPorOperador();
                                getTicketsAsignadosPorOperador();
                                getTicketsAsignadosPorOperadorAbiertos();
                                getTicketsAsignadosPorOperadorCerrados();
                                getTicketsAsignadosPorOperadorProceso();
                                $scope.mostrarContactoBucando($scope.ContactoGlobal);
                            },1000)
                            
                        }else{
                            // console.log("error al agregar ticket");
                            alerta('Error Interno. Por favor, intente nuevamente');
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
        const campos = ['idContacto', 'nombre', 'telefono', 'descripcion', 'direccion', 'dni'];
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
    console.log(idContacto, 'mostrarContacto');
    
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
        $scope.ticketsAsignados = $scope.getTickets.reverse();
       $scope.ContactoGlobal =  $scope.contactoTarjeta;
       console.log($scope.ContactoGlobal);
        // console.log($scope.ticketsAsignados, "ticketsAsignados");
        // console.log($scope.contactoTarjeta[0], "contacto tarjeta")
    if($scope.contactoTarjeta[0] !== undefined){
        $scope.desactivarGuardar = false;
        $scope.mensajeBtnGuardar = "Guardar";
        $scope.btnGuardarTicket = "btn-success";
    }
}

$scope.mostrarContactoBucando = async (contacto)=> {
    $scope.ContactoGlobal = contacto;
    $scope.area = ''
    $scope.asignar = ''
    $scope.categoria = ''
    $scope.estado  = ''
    $scope.historialTicket = ''
    $scope.ticketsAsignados = ''
    $scope.conexionIspCube = '';
    $scope.idConexion = '';
    console.log(contacto, 'mostracontactobuscado');
    await getTicketsBuscar(contacto.dni)
    $timeout(() => {
         $scope.idContactoSeleccionado = contacto.idContacto;
        
        $scope.contactoTarjeta = contacto
        console.log($scope.idContactoSeleccionado, 'mostracontactobuscado')
        $scope.fotoPerfilCard = $scope.contactoTarjeta.urlPerfil;
        // {
        //     'background-image': 'url('+$scope.contactoTarjeta[0].urlPerfil+')',
        //     'background-repeat': 'no-repeat',
        //     'background-size': 'contain',
        //     'background-position': 'center',
        // }
        
        // Obtener los tickets asignados al contacto seleccionado
        $scope.ticketsAsignados = $scope.getTickets.reverse();
       
        // console.log($scope.ticketsAsignados, "ticketsAsignados");

    if($scope.contactoTarjeta !== undefined){
        $scope.desactivarGuardar = false;
        $scope.mensajeBtnGuardar = "Guardar";
        $scope.btnGuardarTicket = "btn-success";
    }
    },1500);
       
}
$scope.handleIdConexionGlobal = (idConexion) => {
    // console.log(idConexion)
    $scope.idConexionSeleccionadaGlobal = $scope.getConexion.find(item => idConexion === item.idConexion + " - " + item.nombre);
    
   
    // console.log("cambio en idConexion global", $scope.idConexionSeleccionadaGlobal.idConexion )
}

$scope.seleccionarTicket = function(ticket, modulo) {
   
    
    // Actualizar los modelos con los valores del ticket seleccionado}
    $timeout(()=>{
        $scope.mensajeBtnGuardar = "Actualizar";
        $scope.btnGuardarTicket = "btn-warning";
        $scope.desactivarGuardar = false;
    }); 
    
    if(modulo === 'misTickets'){
        $scope.mostrarTicketcerrado = false;
        $scope.mostrarTicketAbierto = false;
        $scope.mostrarTicketProceso = false;
        $scope.mostrarMisTickets = false;
        $scope.mostrarCrearTicket = true;
        $scope.idTicketSeleccionado = ticket.idTicket;
        $scope.area = ticket.ticket_area.name;
        $scope.asignar = ticket.assigned_user.name;
        $scope.categoria = ticket.ticket_category.name;
        $scope.estado = ticket.ticket_status.name;
        $scope.conexionIspCube = ticket.connection_name;
        $scope.idConexion = $scope.getConexion.find((item) => {
            return  ticket.connection_id === item.idConexion
        });
        $scope.idConexionSeleccionadaGlobal = $scope.idConexion;
    //    console.log($scope.idConexion)
       if($scope.idConexion !== undefined){
        $scope.idConexion = $scope.idConexion.idConexion + " - " + $scope.idConexion.nombre 
       }
        for (let index = 0; index < ticket.items.length; index++) {
            $scope.historialTicket += '📆'+formatearFechaIspCube(ticket.created_at) + '\n🙍‍♂️' +ticket.items[index].user.name + '\n' + ticket.items[index].content + '\n\n';
        }
    //    console.log($scope.historialTicket)
        
        $scope.mostrarContacto(ticket.idContacto);
        $timeout(()=>{//selecciona el item del acordeon a abrir basado en el idticket y le agrega la clase show para desplegarlo
            const accordion = document.getElementById('panelsStay-collapse'+ticket.idTicket); 
            accordion.classList.add('show');
        });
        
    }else{
        $scope.historialTicket = ''
        $scope.fechaCreacionTkActual = ticket.created_at; //guardo la fecha, por si se actualiza para mantener la misma fecha.
        $scope.idTicketSeleccionado = ticket.id;
        $scope.area = ticket.ticket_area.name;
        $scope.asignar = ticket.assigned_user.name;
        $scope.categoria = ticket.ticket_category.name;
        $scope.estado = ticket.ticket_status.name;
        $scope.conexionIspCube = ticket.connection_name;
        $scope.idConexion = $scope.getConexion.find((item) => {
            return  ticket.connection_id === item.idConexion
        });
        $scope.idConexionSeleccionadaGlobal = $scope.idConexion;
    //    console.log($scope.idConexion)
       if($scope.idConexion !== undefined){
        $scope.idConexion = $scope.idConexion.idConexion + " - " + $scope.idConexion.nombre 
       }
        
       
        for (let index = 0; index < ticket.items.length; index++) {
            $scope.historialTicket += '📆'+formatearFechaIspCube(ticket.created_at) + '\n🙍‍♂️' +ticket.items[index].user.name + '\n' + ticket.items[index].content + '\n\n';
        }
    //    console.log($scope.historialTicket)
    }
    
}

function formatearFechaIspCube(fechaISO) {
    // Convertir la fecha ISO a un objeto Date
    const fecha = new Date(fechaISO);
  
    // Formatear la fecha a dd-MM-yyyy hh:mm:ss
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const anio = fecha.getUTCFullYear();
    const horas = String(fecha.getUTCHours()).padStart(2, '0');
    const minutos = String(fecha.getUTCMinutes()).padStart(2, '0');
    const segundos = String(fecha.getUTCSeconds()).padStart(2, '0');
  
    return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
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

$scope.focoBuscar = () => {
   
    $timeout(() => {
      document.getElementById("buscarContactoModal").focus();
    }, 500);
  };
  $scope.formatDateTicket = function(dateString) {
    var date = new Date(dateString);
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    return day + '/' + month + '/' + year;
};
});