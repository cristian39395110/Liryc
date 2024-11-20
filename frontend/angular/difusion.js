bot.controller(
  "difusionController",
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
    const hostWeb = hostValue;
    $scope.arNombreEncuesta = [];
    $scope.arOpcionesEncuesta = [];
    $scope.idEncuestaGlobal = "";
    $scope.btnGuardarEncuesta = true;
    $scope.btnEditarEncuesta = false;
    $scope.btnGuardarDifusion = true;
    $scope.btnEditarDifusion = false;
    $scope.checkPastel = true;
    $scope.checkBarras = false;
    // $scope.arTemplateDifusion = [{
    //   idDifusion: 1,
    //   titulo: 'difusion random',
    //   mensaje: 'hola soy un mensaje de difusion',
    // }];

    // $scope.arTemplateEncuesta = [{
    //   idEncuesta: 1,
    //   titulo: 'encuesta random',
    //   mensaje: 'hola soy un mensaje de encuesta',
    //   opciones: ['tu madre', 'en tanga']
    // }];

    $scope.arContactos = [];
    $scope.iniciar = function () {
      getContacto();
      // $scope.getEncuestas();
      $scope.getDifusion();
      // $scope.obtenerRespuestaEncuesta();
      getNotificaciones();
    };

    function getContacto() {
      $scope.obtenerContacto = $http.get(
        hostWeb + ":8081/contacto/getContactos"
      );
      $scope.obtenerContacto.then(function (response) {
        $scope.arContactos = response.data;
        $scope.arContactos.map(function(contacto) {
          contacto.telefono = contacto.telefono.replace("@c.us", "");
       });
      });
    }

    $scope.arrConctactoNoty = [];

    $scope.cargarArrayContactos = function (contacto) {
      $scope.arrConctactoNoty.push(contacto);
      $scope.arContactos = $scope.arContactos.filter(
        (valor) => valor.idContacto !== contacto.idContacto
      );
      $scope.arrConctactoNoty.reverse();
    };

    $scope.quitarArrayContactos = function (contacto) {
      $scope.arContactos.push(contacto);
      $scope.arrConctactoNoty = $scope.arrConctactoNoty.filter(
        (valor) => valor.idContacto !== contacto.idContacto
      );
    };

    function getNotificaciones() {
      $scope.arNotify = [];
      $http
        .get(hostWeb + ":8081/notificacion/getNotificaciones")
        .then((response) => {
          $scope.arNotify = response.data;
          $scope.arNotify.map(function(contacto) {
            contacto.telefono = contacto.telefono.replace("@c.us", "");
         });
          console.log($scope.arNotify);
          // Filtrar y contar los mensajes con enviado = 1 y enviado = 0
      $scope.counts = $scope.arNotify.reduce(
        (acc, mensaje) => {
          if (mensaje.enviado === 1) {
            acc.enviado_1++;
          } else if (mensaje.enviado === 0) {
            acc.enviado_0++;
          }
          return acc;
        },
        { enviado_1: 0, enviado_0: 0 }
      );

      console.log(`Mensajes con enviado = 1: ${$scope.counts.enviado_1}`);
      console.log(`Mensajes con enviado = 0: ${$scope.counts.enviado_0}`);
    });
        

    }

    $scope.seleccionarTemplate = function (
      template,
      nombre,
      mensaje,
      idEncuesta
    ) {
      $scope.idTemplateGlobal = template.id;
      if (
        idEncuesta !== undefined &&
        idEncuesta !== null &&
        idEncuesta !== ""
      ) {
        $scope.seleccionarEncuesta(idEncuesta, nombre);
        $scope.nombreTemplate = nombre;
        $scope.mensajeTemplate = mensaje;
        $scope.btnIniciarDifusion = false;
        $scope.btnIniciarEncuesta = true;
      } else {
        $scope.nombreTemplate = nombre;
        $scope.mensajeTemplate = mensaje;
        $scope.btnIniciarDifusion = true;
        $scope.btnIniciarEncuesta = false;
        $scope.arOpciones = [];
      }
    };

    $scope.seleccionarDifusion = function (id) {
      $scope.idDifusionGlobal = id;
      $scope.btnGuardarDifusion = false;
      $scope.btnEditarDifusion = true;
      angular.forEach($scope.arDifusion, function (value) {
        if (value.id == id) {
          $scope.mensajeDifusion = value.mensaje;
          $scope.nombreDifusion = value.nombre;
        }
      });
    };

    $scope.difusion = function (mens, modo) {
      // if(modo == 'produccion'&& ($scope.telefonos==undefined || $scope.telefonos==null || $scope.telefonos=="")){
      //   // $http.post(hostWeb+":8081/difundir",
      //   // {
      //   //     'mensaje': mens
      //   // });
      //   // alerta('Se ha iniciado una difusion a toda su lista de contactos', 'success');
      //   console.log("if incorrecto")

      // }
      // else if(modo=='produccion' && $scope.telefonos!=undefined && $scope.telefonos!=null && $scope.telefonos!=""){
      //   //usar hostWeb+":8081/difundir cuando se quiera cargar un excel y difundir es para enviar desde los contactos
      //   $http.post(hostWeb+":8081/difundir",
      //   {
      //       'mensaje': mens,
      //       'telefonos':$scope.telefonos

      //   });
      //   console.log("if correcto")
      //   alerta('Se ha iniciado una difusion a toda su lista de contactos', 'success');
      // }

      console.log($scope.telefonoTestDifusion)

      if (modo == "test" && $scope.telefonoTestDifusion !== undefined) {
        $http.post(hostWeb + ":8081/notificacion/difundirTest", {
          mensaje: mens,
          telefono: $scope.telefonoTestDifusion,
        });
        alerta(
          "Se ha enviado un mensaje de prueba al numero: " +
            $scope.telefonoTestDifusion,
          "success"
        );
      }else{
        alerta(
          "Primero escribe un número de télefono antes de enviar el mensaje de prueba ",
          "danger"
        );
      }
      $scope.telefonos = "";
    };

    $scope.insertDifusion = function (mens, nombre) {
      if (
        mens != undefined &&
        mens != null &&
        mens != "" &&
        nombre != undefined &&
        nombre != null &&
        nombre != ""
      ) {
        $http
          .post(hostWeb + ":8081/notificacion/insertDifusion", {
            mensaje: mens,
            nombre: nombre,
          })
          .then(function (response) {
            $scope.getDifusion();
            alerta("Se guardo exitosamente su difusion!", "success");
          });
      } else {
        alerta("Falta completar un campo!", "danger");
      }
    };

    $scope.arDifusion = [];

    $scope.getDifusion = function () {
      $http
        .get(hostWeb + ":8081/notificacion/getDifusion")
        .then(function (response) {
          $scope.arDifusion = response.data;
        });
      $scope.mensajeDifusion = "";
      $scope.nombreDifusion = "";
    };

    $scope.deleteDifusion = function () {
      $scope.btnGuardarDifusion = true;
      $scope.btnEditarDifusion = false;
      if($scope.idDifusionGlobal !== undefined){
      $http
        .post(hostWeb + ":8081/notificacion/deleteDifusion", {
          id: $scope.idDifusionGlobal,
        })
        .success(function (response) {
          if (response) {
            $scope.getDifusion();
            $scope.mensajeDifusion = "";
            $scope.nombreDifusion = "";
            alerta("Se elimino exitosamente su plantilla!", "success");
          }
        });
      }else{
        alerta("Primero selecciona una plantilla para poder eliminarla", "danger");
      }
    };

    $scope.editarDifusion = function (nombre, mensaje) {
      $scope.btnGuardarDifusion = true;
      $scope.btnEditarDifusion = false;
      if (
        mensaje != undefined &&
        mensaje != null &&
        mensaje != "" &&
        nombre != undefined &&
        nombre != null &&
        nombre != ""
      ) {
        $http
          .post(hostWeb + ":8081/notificacion/editarDifusion", {
            id: $scope.idDifusionGlobal,
            nombre: nombre,
            mensaje: mensaje,
          })
          .success(function (response) {
            if (response) {
              $scope.getDifusion();
              alerta("Se editó exitosamente su difusion!", "warning");
              $scope.nombreDifusion = "";
              $scope.mensajeDifusion = "";
            }
          });
      } else {
        alerta(
          "Falta completar un campo para poder editar su difusion!",
          "danger"
        );
      }
    };

    // $scope.estadisticasDifusion = false;
    $scope.showDifundir = true;
    $scope.difusionClass = "menuNavActive";
    $scope.rutasDifusion = function (ruta) {
      $scope.showTemplateDifusion = false;
      $scope.showTemplateEncuesta = false;
      if (ruta == "sidebot") {
        $scope.estadisticasDifusion = true;
        $scope.showDifundir = false;
        $scope.showTemplateDifusion = false;
        $scope.showTemplateEncuesta = false;
        $scope.showContactos = false;
        $window.location.href = hostWeb + "/Liryc/frontend/";
        $scope.sidebotClass = "menuNavActive";
        $scope.notifyCrearClass = "";
        $scope.estadisticasClass = "";
        $scope.difusionClass = "";
        $scope.difusionCrearClass = "";
        $scope.encuestasClass = "";
        $scope.contactosClass = "";
        $scope.showMisNotificaciones = false;
      } else if (ruta == "estadisticas") {
        $scope.estadisticasDifusion = true;
        $scope.showDifundir = false;
        $scope.showTemplateDifusion = false;
        $scope.showTemplateEncuesta = false;
        $scope.showContactos = false;
        $scope.sidebotClass = "";
        $scope.estadisticasClass = "menuNavActive";
        $scope.difusionClass = "";
        $scope.difusionCrearClass = "";
        $scope.encuestasClass = "";
        $scope.contactosClass = "";
      } else if (ruta == "difusion") {
        $scope.estadisticasDifusion = false;
        $scope.showDifundir = true;
        $scope.showTemplateDifusion = false;
        $scope.showTemplateEncuesta = false;
        $scope.showContactos = false;
        $scope.notifyCrearClass = "";
        $scope.sidebotClass = "";
        $scope.estadisticasClass = "";
        $scope.difusionClass = "menuNavActive";
        $scope.difusionCrearClass = "";
        $scope.encuestasClass = "";
        $scope.contactosClass = "";
        $scope.showMisNotificaciones = false;
      } else if (ruta == "crearDifusion") {
        $scope.estadisticasDifusion = false;
        $scope.showDifundir = false;
        $scope.showTemplateDifusion = true;
        $scope.showTemplateEncuesta = false;
        $scope.showContactos = false;
        $scope.notifyCrearClass = "";
        $scope.sidebotClass = "";
        $scope.estadisticasClass = "";
        $scope.difusionClass = "";
        $scope.difusionCrearClass = "menuNavActive";
        $scope.encuestasClass = "";
        $scope.contactosClass = "";
        $scope.showMisNotificaciones = false;
        $scope.btnIniciarDifusion = false;
      } else if (ruta == "misNotificaciones") {
        $scope.showMisNotificaciones = true;
        $scope.estadisticasDifusion = false;
        $scope.showDifundir = false;
        $scope.showTemplateDifusion = false;
        $scope.showTemplateEncuesta = false;
        $scope.showContactos = false;
        $scope.notifyCrearClass = "menuNavActive";
        $scope.sidebotClass = "";
        $scope.estadisticasClass = "";
        $scope.difusionClass = "";
        $scope.difusionCrearClass = "";
        $scope.encuestasClass = "";
        $scope.contactosClass = "";
        $scope.btnIniciarDifusion = false;
      }
      //else if(ruta == 'crearEncuesta'){
      //   $scope.estadisticasDifusion = false;
      //   $scope.showDifundir = false;
      //   $scope.showTemplateDifusion = false;
      //   $scope.showTemplateEncuesta = true;
      //   $scope.showContactos = false;
      //   $scope.sidebotClass = '';
      //   $scope.estadisticasClass = '';
      //   $scope.difusionClass = '';
      //   $scope.difusionCrearClass = '';
      //   $scope.encuestasClass = 'menuNavActive';
      //   $scope.contactosClass = '';
      // }else if(ruta == 'contactos'){
      //   $scope.estadisticasDifusion = false;
      //   $scope.showDifundir = false;
      //   $scope.showTemplateDifusion = false;
      //   $scope.showTemplateEncuesta = false;
      //   $scope.showContactos = true;
      //   $scope.sidebotClass = '';
      //   $scope.estadisticasClass = '';
      //   $scope.difusionClass = '';
      //   $scope.difusionCrearClass = '';
      //   $scope.encuestasClass = '';
      //   $scope.contactosClass = 'menuNavActive';
      //}
      //
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
    function alertaCrearNotify(mensaje, status) {
      SnackBar({
        message: mensaje,
        dismissible: true,
        status: status,
        timeout: 8000,
        position: "br",
      });
      return false;
    }

    function errorCrearNotify(mensaje, status) {
      SnackBar({
        message: mensaje,
        dismissible: true,
        status: status,
        timeout: 8000,
        position: "br",
      });
      return false;
    }

    $scope.guardarConfiguracionNotificacion = function (fecha, contactos) {
      console.log(contactos, fecha, $cookies.get("usuario"));
      if (fecha !== undefined && contactos.length > 0) {
        $http
          .post(hostWeb + ":8081/notificacion/guardarConfiguracionNotify", {
            fecha: formatoFechayHora(fecha),
            contactos,
            template: $scope.idTemplateGlobal,
            usuario: $cookies.get("usuario")
          })
          .then((response) => {
            if (response) {
              alertaCrearNotify(
                "Se guardo exitosamente su configuracion!",
                "success"
              );
              $scope.fechaYHoraNotificacion = undefined;
              $scope.arrConctactoNoty = [];
              getContacto();
              getNotificaciones();
              $scope.nombreTemplate = "";
              $scope.mensajeTemplate = "";
              $scope.btnIniciarDifusion = false;
            }
          });
      } else {
        errorCrearNotify(
          "Debe completar todos los campos antes de guardar",
          "danger"
        );
      }
    };

    $scope.eliminarNotify = function (idNoty) {
      $http.post(hostWeb + ":8081/notificacion/eliminarNotify", {
          idNotify: idNoty,
        })
        .then((response) => {
          alerta(
            "Se ha eliminado la notificacion N° " + idNoty + " correctamente!",
            "success"
          );
          getNotificaciones();
        });
    };

    function formatoFechayHora(fechaHTML) {
      // Convertir a objeto Date
      const fecha = new Date(fechaHTML);

      // Obtener los componentes de fecha y hora
      const year = fecha.getFullYear();
      const month = fecha.getMonth() + 1; // Los meses en JavaScript son base 0 (enero es 0)
      const day = fecha.getDate();
      const hours = fecha.getHours();
      const minutes = fecha.getMinutes();
      const seconds = fecha.getSeconds();

      // Formatear a cadena de texto en el formato YYYY-MM-DD HH:MM:SS
      const fechaMySQL = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      return fechaMySQL;
    }

    $scope.imagenNoCargada = (elementoImg) =>{
      elementoImg.src = './style/perfilVacio.png'; // Puedes establecer una imagen predeterminada
      elementoImg.alt = 'Error al cargar la imagen';
  }

  // $scope.showFecha = true;
  // $scope.showContacto = false;
  // $scope.showPlantillas = false;
  // $scope.handleCrearNotificacion = (evento) =>{
  //   switch (evento) {
  //     case 'fecha':
        
  //       break;

  //     case 'contacto':
      
  //     break;

  //     case 'plantilla':
      
  //     break;
  //     default:
  //       break;
  //   }
    
  // }


  }
);
