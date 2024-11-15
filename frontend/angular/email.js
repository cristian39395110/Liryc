bot.controller(
  "emailController",
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
        $window.location.href = hostWeb + "/medusa/frontend/";
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
    };

    $scope.iniciar = function () {
      getContacto();     
    };

    function getContacto() {
      $scope.obtenerContacto = $http.get(
        hostWeb + ":8081/contacto/getContactos"
      );
      $scope.obtenerContacto.then(function (response) {
        $scope.arContactos = response.data;
      });
    }

    $scope.arrConctactoNoty = [];

    $scope.cargarArrayContactos = function (contacto) {
      $scope.arrConctactoNoty.push(contacto);
      $scope.arContactos = $scope.arContactos.filter(
        (valor) => valor.idContacto !== contacto.idContacto
      );
    };

    $scope.quitarArrayContactos = function (contacto) {
      $scope.arContactos.push(contacto);
      $scope.arrConctactoNoty = $scope.arrConctactoNoty.filter(
        (valor) => valor.idContacto !== contacto.idContacto
      );
    };

    $scope.getPlantillasDeCorreo = function(){
        $http.get('/email/getPlantillaCorreo')
        .then((response) => {
            console.log(response.data);
        })
    }    

    function enviarEmail(plantilla,contactos) {
      $http
        .post(hostWeb + ":8081/email/enviarMail", {
          plantilla: plantilla,
          contactos: contactos,
        })
        .then((response) => {
          console.log(response);
        });
    }
  }
);
