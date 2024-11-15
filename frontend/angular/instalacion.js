bot.controller(
  "contactoController",
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


// LA IDEA ES HACER QUE SE PUEDA BUSCAR CONTACTOS E IR CARGANDO UN LISTADO DE CONTACTOS DONDE ENTRAR EN ESTADO "PENDINDE DE ACEPTAR TEMRINOS Y CONDICIONES".
//EL SISTEMA DEBE DAR POSIBLIDAD A QUE SE ENVIE UN MENSAJE AL CLIENTE, EL CLIENTE DEBERIA SER INSERTADO EN LA TABLA MENUCLIENTE EN UN ESTADO DE TERMINOS Y CONDICIONES.
//SE DEBE CONTROLAR CUANDO INGRESAN NUEVOS MENSAJES QUE EL CLIENTE CUANDO ESTE EN ESE ESTADO CONTESTE CON SI O CON NO (1, 2) PARA ACEPTAR O RECHAZAR EL CONTRATO.
//EL CLIENTE QUE RECHACE EL CONTRATO DEBE ENTRAR EN CLINTE ACTIVO EN VENTAS DESCRIBIENDO EL MOTIVO DEL RECHAZO DEL CONTRATO Y SERA UN PROBLEMA A RESOLVER PARA EL AREA DE VENTAS
//SI EL CLIENTE ACEPTA LOS TERMINOS, SE LE ENVIA UN MENSAJE DE DESPEDIDA DICIENDO QUE UN TECNICO SE PONDRA EN CONTACTO PARA COORDINAR DIA Y FECHA.

    $scope.mostrarMisTickets = false;
    $scope.mostrarCrearTicket = true;
    $scope.mostrarTicketcerrado = false;
    $scope.mostrarTicketAbierto = false;
    $scope.mostrarTicketProceso = false;
    $scope.desactivarGuardar = true;
    $scope.mensajeBtnGuardar =
      "Antes de guardar debes buscar un contacto o pulsar +Nuevo";
    $scope.contactoTarjeta = {};
    $scope.nombreUsuarioCookie = $cookies.get("usuario");
    const rangoUsuario = $cookies.get("rango");
    $scope.rangoActual = rangoUsuario;
    $scope.categorias = ["facturacion", "servicio tecnico", "ventas"];
    $scope.btnGuardarTicket = "btn-success";

    const hostWeb = hostValue;

    /**
     * Función que inicia la aplicación llamando a otras funciones para obtener datos de contacto, áreas y operadores.
     * @function iniciarApp
     * @returns {void}
     */
    $scope.iniciarApp = () => {
      checkLogin();
      getContacto();
    };

    function checkLogin() {
      if (rangoUsuario == undefined) {
        $window.location.href = hostWeb + "/sidelink/frontend/login.html";
      }
    }
      $scope.refrecarContactos = function(){
        $http.get('http://132.255.224.147:5034/refrescarContactos')
        .then(function(response){
          console.log(response);
          $timeout(function(){
            alerta('importacion exitosa', 'success');
          },2000);
          
        })
      }

    /**
     * Función que maneja la navegación del menú.
     * @function navMenu
     * @param {string} menu - El nombre del menú seleccionado.
     * @returns {void}
     */
    $scope.navMenu = function (menu) {
      if (menu === "chat") {
        $window.location.href = hostWeb + "/sidelink/frontend/";
      } else if (menu === "crear" && $scope.mostrarCrearTicket == false) {
        $scope.tituloTickets = " ";
        $scope.mostrarMisTickets = false;
        $scope.mostrarCrearTicket = true;
        $scope.mostrarTicketcerrado = false;
        $scope.mostrarTicketAbierto = false;
        $scope.mostrarTicketProceso = false;
      } else if (menu === "mis" && $scope.mostrarMisTickets == false) {
        $scope.tituloTickets = " - Mis Contactos";
        $scope.mostrarMisTickets = true;
        $scope.mostrarCrearTicket = false;
        $scope.mostrarTicketcerrado = false;
        $scope.mostrarTicketAbierto = false;
        $scope.mostrarTicketProceso = false;
      } else if (menu === "abierto" && $scope.mostrarTicketAbierto == false) {
        $scope.tituloTickets = " - Tickets Abiertos";
        $scope.mostrarMisTickets = false;
        $scope.mostrarCrearTicket = false;
        $scope.mostrarTicketcerrado = false;
        $scope.mostrarTicketAbierto = true;
        $scope.mostrarTicketProceso = false;
      } else if (menu === "enProceso" && $scope.mostrarTicketProceso == false) {
        $scope.tituloTickets = " - Ticket en proceso";
        $scope.mostrarMisTickets = false;
        $scope.mostrarCrearTicket = false;
        $scope.mostrarTicketcerrado = false;
        $scope.mostrarTicketAbierto = false;
        $scope.mostrarTicketProceso = true;
      } else if (menu === "cerrado" && $scope.mostrarTicketcerrado == false) {
        $scope.tituloTickets = " - Ticket Cerrados";
        $scope.mostrarMisTickets = false;
        $scope.mostrarCrearTicket = false;
        $scope.mostrarTicketcerrado = true;
        $scope.mostrarTicketAbierto = false;
        $scope.mostrarTicketProceso = false;
      }
    };

    /**
     * Función que obtiene los contactos mediante una petición HTTP GET.
     * @function getContacto
     * @returns {$scope.getContacto}
     */
    const getContacto = () => {
      $http.get(hostWeb + ":8081/contacto/getContactos").then((response) => {
        $scope.getContacto = response.data;
        $scope.getContacto.map(function(contacto) {
          contacto.telefono = contacto.telefono.replace("@c.us", "");
       });
       $scope.getContacto = $scope.getContacto.reverse();
        $scope.objContactos = $scope.getContacto.slice(-10);
        console.log($scope.getContacto);
      });
    };

    function obtenerFechaActual() {
      // Obtener la fecha actual
      const fechaActual = new Date();

      // Obtener el día, mes y año de la fecha actual
      const dia = fechaActual.getDate();
      const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript comienzan desde 0 (enero = 0)
      const anio = fechaActual.getFullYear();

      // Formatear la fecha en el formato "dd/mm/yyyy"
      const fechaFormateada = `${dia < 10 ? "0" : ""}${dia}/${
        mes < 10 ? "0" : ""
      }${mes}/${anio}`;

      // Retornar la fecha formateada
      return fechaFormateada;
    }

    $scope.borrarContacto = async () => {
      try {
        const confirmacion = await confirmCustom(
          "¿Estás seguro de que deseas eliminar este contacto?",
          "danger"
        );
        console.log(confirmacion);
        if (confirmacion) {
          const response = await $http.post(hostWeb + ":8081/contacto/borrarContacto", {
            idContacto: $scope.contactoTarjeta[0].idContacto,
          });
          if (response) {
            alerta("Contacto eliminado", "danger");
          }
          setTimeout(() => {
            $scope.nuevoTicket();
            getContacto();
          }, 100); // Agrega un retraso de 100 milisegundos antes de llamar a las funciones
        }
      } catch (error) {
        if (error === "Cancelado") {
          // El usuario ha cancelado la acción
        }
      }
    };

    $scope.insertContacto = (
      nombre,
      telefono,
      direccion,
      producto,
      descripcion,
      dni
    ) => {
      // !telefono.startsWith("549") ? (telefono = "549" + telefono) : false;
      // !telefono.includes("@c.us") ? (telefono = telefono + "@c.us") : false;
      console.log(nombre, telefono, direccion, producto, descripcion);

      var route = "";
      
      if ((nombre === "" || telefono === "")) {
        // Manejar el caso en el que alguno de los parámetros sea undefined
        console.error("Alguno de los parámetros es undefined.");
        alerta("El campo *Nombre y *Telefono son obligatorios", "danger");
      } else {
        if(telefono.length <= 9 || isNaN(telefono)){
alerta(`El número de teléfono no es valido. Debe tener el siguiente formato: 2657112233`, "danger");
        }else{
        
        // Manejar el caso en el que ninguno de los parámetros sea undefined
        if ($scope.mensajeBtnGuardar === "Guardar") {
          //si el boton es "Guardar llama a insertContacto"
          route = "guardarContacto";
        } else {
          //si no, es "actualizar" y llama a updateContacto
          route = "editarContacto";
          fechaActual = $scope.fechaCreacionTkActual;
        }
        console.log($scope.contactoTarjeta[0], "urlPerdfil");
        $scope.contactoTarjeta[0] === undefined
          ? ($scope.contactoTarjeta[0] = "")
          : false;
        $http
          .post(hostWeb + ":8081/contacto/" + route, {
            idContacto: $scope.idContactoSeleccionado,
            nombre,
            telefono,
            direccion,
            producto,
            descripcion,
            urlPerfil: $scope.contactoTarjeta[0].urlPerfil,
            dni
          })
          .then((response) => {
            if (response) {
              console.log("contacto agregado");
              if (route === "guardarContacto") {
                $scope.nuevoTicket();
              }
              alerta("Guardado correctamente", "success");
              getContacto();
            } else {
              console.log("error al agregar contacto");
              alerta(
                "Error al agregar contacto, por favor contacte con soporte.",
                "darnger"
              );
            }
          });
        }
      }
    };

    $scope.buscarContacto = (contacto) => {
      if (contacto !== undefined) {
        //evento.keyCode === 13 &&
        $scope.objContactos = []; // Vaciar el arreglo antes de cada búsqueda
        angular.forEach($scope.getContacto, (value) => {
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
        console.log($scope.objContactos);
      }
    };

    // $scope.mostrarContacto = (idContacto)=> {
    //     $scope.desactivarGuardar = false;
    //     $scope.mensajeBtnGuardar = "Guardar";

    //     $scope.contactoTarjeta = [];
    //     $scope.contactoTarjeta = $scope.getContacto.filter(value => {
    //         return value.idContacto === idContacto;
    //     });
    //     console.log($scope.contactoTarjeta);
    // }

    $scope.mostrarContacto = (idContacto) => {
      $scope.desactivarGuardar = false;
      $scope.mensajeBtnGuardar = "Actualizar";
      $scope.btnGuardarTicket = "btn-warning";
      $scope.idContactoSeleccionado = idContacto;
      $scope.contactoTarjeta = $scope.getContacto.filter((value) => {
        return value.idContacto === idContacto;
      });
      $scope.nombre = $scope.contactoTarjeta[0].nombre;
      $scope.telefono = $scope.contactoTarjeta[0].telefono.replace("@c.us", "");
      $scope.telefono = $scope.telefono.startsWith("549")
        ? $scope.telefono.substring(3)
        : $scope.telefono; // si empieza con '549' se lo quito
      $scope.direccion = $scope.contactoTarjeta[0].direccion;
      $scope.producto = $scope.contactoTarjeta[0].producto;
      $scope.descripcionContacto = $scope.contactoTarjeta[0].descripcion;
      $scope.fotoPerfilCard = $scope.contactoTarjeta[0].urlPerfil
      $scope.dni = $scope.contactoTarjeta[0].dni;
    };

    $scope.nuevoTicket = () => {
      $scope.contactoTarjeta = {};
      $scope.fotoPerfilCard = null;
      $scope.nombre = "";
      $scope.telefono = "";
      $scope.direccion = "";
      $scope.producto = "";
      $scope.descripcionContacto = "";
      $scope.dni = "";
      $scope.mensajeBtnGuardar = "Guardar";
      $scope.btnGuardarTicket = "btn-success";
      $scope.desactivarGuardar = false;
    };

    function alerta(mensaje, status) {
      SnackBar({
        message: mensaje,
        dismissible: true,
        status: status,
        timeout: 8000,
        position: "tr",
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
              text: "Aceptar",
              function: function () {
                resolve(true);
              },
              dismiss: true, // Indica que se debe cerrar el Snackbar después de hacer clic en "Aceptar"
            },
            {
              text: "Cancelar",
              function: function () {
                resolve(false);
              },
              dismiss: true, // Indica que se debe cerrar el Snackbar después de hacer clic en "Cancelar"
            },
          ],
        });
      });
    }

    $scope.focoBuscar = () => {
      console.log("entra");
      $timeout(() => {
        document.getElementById("buscarContactoModal").focus();
      }, 500);
    };


    $scope.imagenNoCargada = (elementoImg) =>{
      elementoImg.src = './style/perfilVacio.png'; // Puedes establecer una imagen predeterminada
      elementoImg.alt = 'Error al cargar la imagen';
  }
  }
);
