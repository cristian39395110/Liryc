bot.controller("estadisticasController", function($window, $scope, $http, $cookies,$filter,$timeout, $rootScope, $interval, hostValue){

  $scope.areasFiltradas = [];
  $scope.empleadosFiltrados = [];
  $scope.mensajes = "";
  $scope.cantidadMensajes = [];
  $scope.arAreas= [];
  $scope.arAtentidos = [];
  $scope.arNoAtentidos = [];
  $scope.checkPastel = true;
  $scope.checkBarras = false;
  $scope.grafic = "";
  $scope.gridGraficos = "gridGraficos";
  $scope.spinner = true;
  // $scope.fechaDesde = new Date();

  const hostWeb = hostValue+":8081/"; //cambiar por 127.0.0.1
  const redireccionar = hostValue+"/"
  obtenerCantidadMensajes();
  setInterval(() => {
          
    obtenerClienteAtendido();
    obtenerClienteNoAtendido();
    }, 10000);
      $scope.iniciarApp = function(){
       
        obtenerConsultas();
         
          
          // $scope.spinner = false;
        
       
      }
  

  var obtenerClienteAtendido = () => {
    $http.get(hostWeb+'estadisticas/clienteAtendido')
    .then((response)=>{
      filtrarClienteAtendido(response.data);
    });
  }

  var obtenerClienteNoAtendido = () => {
    $http.get(hostWeb+'estadisticas/clienteNoAtendido')
    .then((response)=>{
      filtrarClienteNoAtendido(response.data);
    });
  }

   // Función para convertir un string de fecha en un objeto Date
   function convertirFecha(fechaStr) {
    // Formato: "30/06/2024 - 18:22:33"
    var partes = fechaStr.split(" - ");
    var fechaPartes = partes[0].split("/");
    var horaPartes = partes[1].split(":");
    return new Date(fechaPartes[2], fechaPartes[1] - 1, fechaPartes[0], horaPartes[0], horaPartes[1], horaPartes[2]);
  }
  $scope.noAtendidos = {}; // Objeto para almacenar las fechas de los mensajes de clientes no atendidos
  $scope.tiempoDeDemora = [];
 // Función para agregar un cliente no atendido
 function agregarClienteNoAtendido(cliente) {
  var fechaMensaje = convertirFecha(cliente.fecha);
  $scope.noAtendidos[cliente.idClienteActivo] = fechaMensaje;
  
}


   // Función para calcular la demora
   function calcularDemora(clienteAtendido) {
    var idCliente = clienteAtendido.idClienteActivo;
    if ($scope.noAtendidos[idCliente]) {
      var fechaMensajeCliente = $scope.noAtendidos[idCliente];
      var fechaMensajeOperador = convertirFecha(clienteAtendido.fecha);
      
      var demora = fechaMensajeOperador - fechaMensajeCliente; // Diferencia en milisegundos

     // Convertir demora a horas, minutos y segundos
     var horas = Math.floor(demora / 3600000).toString().padStart(2, '0');
     var minutos = Math.floor((demora % 3600000) / 60000).toString().padStart(2, '0');
     var segundos = Math.floor((demora % 60000) / 1000).toString().padStart(2, '0');
     
      console.log(`Demora para el cliente ${idCliente}: ${horas} horas, ${minutos} minutos, ${segundos} segundos`);
      $scope.tiempoDeDemora[idCliente] = `${horas}:${minutos}:${segundos}`
      // Eliminar el cliente del objeto no atendidos
      delete $scope.noAtendidos[idCliente];
    }
  }

  // Filtrar clientes no atendidos
  var filtrarClienteNoAtendido = (noAtendidos) => { 
    var aux = [];
    var nuevosNoAtendidos = [];
    angular.forEach(noAtendidos, item => {
      if (!aux.includes(item.telefono)) {
        item.telefono = item.telefono.replace('@c.us', '');
        nuevosNoAtendidos.push(item);
        agregarClienteNoAtendido(item);
        aux.push(item.telefono + '@c.us');
      }
    });
    $scope.arNoAtentidos = nuevosNoAtendidos;
    
  }

  // Filtrar clientes atendidos
  var filtrarClienteAtendido = (atendidos) => { 
    var aux = [];
    var nuevosAtendidos = [];
    angular.forEach(atendidos, item => {
      if (!aux.includes(item.telefono)) {
        item.telefono = item.telefono.replace('@c.us', '');
        nuevosAtendidos.push(item);
        calcularDemora(item);
        aux.push(item.telefono + '@c.us');
      }
    });
    $scope.arAtentidos = nuevosAtendidos;
    
  }

  function obtenerCantidadMensajes(){
    $http.get(hostWeb+'estadisticas/mensaje')
    .success(function(value){
      $scope.mensajes = value; 
      obtenerEmpleados();
      $scope.iniciarApp()
    });
  }
  
  var obtenerEmpleados = function(){
    $http.get(hostValue+':8082/chat/empleados')
    .success(function(value){
      $scope.empelados = value;
      
      filtrarAreas(value);
      filtrarEmpleados($scope.empelados);
    });
  }
  
  var obtenerConsultas = function(){
    $scope.consultasX = [];
    $scope.consultasy = [];
    $http.get(hostWeb+'estadisticas/consultas')
    .then(function(value){
      $scope.consultas = value.data;
      angular.forEach($scope.consultas, value => {
        if(!$scope.consultasX.includes(value.area)){
          $scope.consultasX.push(value.area);
          $scope.consultasy.push(value.consultas);
        }
      });
      $timeout(()=>{
        $scope.graficos('pastel');
      },500)
     
    });
    
  }

  var filtrarAreas = function(empleados){
    var aux = [];
    angular.forEach(empleados, value => {
      if(!aux.includes(value.rango) && value.rango !== 'medusa'){
        aux.push(value.rango);
      }
    });
    $scope.areasFiltradas = aux;
  }
  
  var filtrarEmpleados = function(empleados){
    var aux = [];
    angular.forEach(empleados, value => {
      if(!aux.includes(value.nombre)){
        aux.push(value.nombre);
      }
    });
    $scope.empleadosFiltrados = aux;
  }
  
  var calculaCantidadPorArea = function(areas, mensajes){
    var cont = 0;
    var auxArea = [];
    var auxCantidad = [];
    $scope.cantidadEnviadosPorArea = 0;
   angular.forEach(areas, area => {
    
    angular.forEach(mensajes, mensaje => {
      if(area === mensaje.rangoMensaje ){ //&& mensaje.estado == 0
        cont++;
        $scope.cantidadEnviadosPorArea++;
      }
    });
    auxCantidad.push(cont);
    cont = 0;
    auxArea.push(area);
   });
  //  console.log(auxCantidad);
  //  console.log(auxArea);
   var obj = {
    'cantidad': auxCantidad,
    'area': auxArea
   }
   return obj;
  }

  var calculaCantidadPorOperador = function(operadores, mensajes){
    var cont = 0;
    $scope.cantidadtotalPorOperador = 0;
    var auxOperador = [];
    var auxCantidad = [];
   angular.forEach(operadores, operador => {
    
    angular.forEach(mensajes, mensaje => {
      if(operador === mensaje.nombreUsuario){
        cont++;
        $scope.cantidadtotalPorOperador++;
      }
    });
    auxCantidad.push(cont);
    cont = 0;
    auxOperador.push(operador);
   });
  //  console.log(auxCantidad);
  //  console.log(auxOperador);
   var obj = {
    'cantidad': auxCantidad,
    'operador': auxOperador
   }
   return obj;
  }
  
  function mGetDate(year, month){
    var d = new Date(year, month, 0);
    return d.getDate();
  }

  
  $scope.filtrarPorFecha = function(fechaDesde, fechaHasta){
    console.log(fechaDesde);
    console.log(fechaHasta);
    var dia = new Date(fechaDesde).getDate();
    dia = dia.toString().padStart(2, '0');
    var mes = new Date(fechaDesde).getMonth()+1;
    mes = mes.toString().padStart(2, '0');
    var año = new Date(fechaDesde).getFullYear();
    var diaHasta = new Date(fechaHasta).getDate();
    diaHasta = diaHasta.toString().padStart(2, '0');
    var mesHasta = new Date(fechaHasta).getMonth()+1;
    mesHasta = mesHasta.toString().padStart(2, '0');
    var añoHasta = new Date(fechaHasta).getFullYear();
    if(fechaHasta === undefined){
      alerta('Obteniendo informacion...', 'primary', 1000);
     console.log(dia+'-'+mes+'-'+año, "fecha desde")
     $http.post(hostWeb+'estadisticas/buscarPorFechaDesde',
    {
      fechaDesde: dia+'-'+mes+'-'+año,
    })
    .then(response => { 
      // console.log(response.data);
      if(response.data.length === 0){
        alerta('no se ha encontrado ningun resultado en esta fecha', 'warning', 8000);
      }else{
        alerta('Informacion obtenida exitoasamete', 'success', 8000);
        $scope.mensajes = response.data;
        // clearInterval($scope.intervalInicial);
        
        $scope.iniciarApp();
        obtenerEmpleados();
      }
      
    }); 
    }else{
      alerta('Obteniendo informacion...', 'primary', 1000);
      $http.post(hostWeb+'estadisticas/buscarPorRangoDeFechas',
    {
      fechaDesde: dia+'-'+mes+'-'+año,
      fechaHasta: diaHasta+'-'+mesHasta+'-'+añoHasta,
    })
    .then(response => { 
      // console.log(response.data);
      if(response.data.length === 0){
        alerta('no se ha encontrado ningun resultado en esta fecha', 'warning', 8000);
      }else{
        alerta('Informacion obtenida exitoasamete', 'success');
        $scope.mensajes = response.data;
        // clearInterval($scope.intervalInicial);
        clearTimeout($scope.grafic);
        $scope.iniciarApp();
        obtenerEmpleados();
      }
      
    }); 
    }
    
  }

  const mensajesEnviadosPorHora = (mensajes) => { //mensajes recibidos
    // Agrupar los mensajes por hora
    const mensajesPorHora = mensajes.reduce((grupos, mensaje) => {
      // Obtener la hora del mensaje
      const fechaMensaje = mensaje.fecha.split(" ");
      const horaMensaje = parseInt(fechaMensaje[2].split(":")[0], 10);
     
     // Validar que el mensaje sea recibido por un usuario
     if (mensaje.estado === 0) {
       // Agregar el mensaje al grupo correspondiente
       if (grupos[horaMensaje]) {
         grupos[horaMensaje].push(mensaje);
       } else {
         grupos[horaMensaje] = [mensaje];
       }
     }
  
      return grupos;
    }, {});
  
    // Obtener la cantidad de mensajes y las horas correspondientes
    const cantidadMensajesPorHora = [];
    const horasPorCantidadMensajes = [];
    $scope.cantidadDeMensajesEnviadosPorHora = 0;
    for (let hora = 0; hora < 24; hora++) {
      const mensajesEnHora = mensajesPorHora[hora] || [];
      cantidadMensajesPorHora.push(mensajesEnHora.length);
      $scope.cantidadDeMensajesEnviadosPorHora += mensajesEnHora.length;
      horasPorCantidadMensajes.push(`${hora.toString().padStart(2, "0")}:00`);
    }
  
    // Retornar el objeto con los arrays de cantidad de mensajes y horas correspondientes
    return {
      cantidadMensajes: cantidadMensajesPorHora,
      horas: horasPorCantidadMensajes,
    };
  };
  
  const contarMensajesPorHora = (mensajes) => { //mensajes recibidos
    // Agrupar los mensajes por hora
    const mensajesPorHora = mensajes.reduce((grupos, mensaje) => {
      // Obtener la hora del mensaje
      const fechaMensaje = mensaje.fecha.split(" ");
      const horaMensaje = parseInt(fechaMensaje[2].split(":")[0], 10);
     
     // Validar que el mensaje sea recibido por un usuario
     if (mensaje.estado === 1 && mensaje.nombreUsuario === "usuario") {
       // Agregar el mensaje al grupo correspondiente
       if (grupos[horaMensaje]) {
         grupos[horaMensaje].push(mensaje);
       } else {
         grupos[horaMensaje] = [mensaje];
       }
     }
  
      return grupos;
    }, {});
  
    // Obtener la cantidad de mensajes y las horas correspondientes
    const cantidadMensajesPorHora = [];
    const horasPorCantidadMensajes = [];
    $scope.cantidadDeMensajesRecibidosPorHora = 0;
    for (let hora = 0; hora < 24; hora++) {
      const mensajesEnHora = mensajesPorHora[hora] || [];
      cantidadMensajesPorHora.push(mensajesEnHora.length);
      $scope.cantidadDeMensajesRecibidosPorHora += mensajesEnHora.length;
      horasPorCantidadMensajes.push(`${hora.toString().padStart(2, "0")}:00`);
    }
    console.log($scope.cantidadDeMensajesRecibidosPorHora)
    // Retornar el objeto con los arrays de cantidad de mensajes y horas correspondientes
    return {
      cantidadMensajes: cantidadMensajesPorHora,
      horas: horasPorCantidadMensajes,
    };
  };
  
  var calcularPalabrasFrecuentes = function(mensajes){
    // Crear un array de todas las palabras de los mensajes
    let todasLasPalabras = [];
    mensajes.forEach(mensaje => {
        const palabras = mensaje.mensaje.split(" ");
        palabras.forEach(palabra => {
            if (palabra.length > 0) {
                todasLasPalabras.push(palabra);
            }
        });
      });

      // Palabras y símbolos que deseas excluir
      const palabrasExcluidas = [
        "el", "la", "los", "las", "un", "una", "unos", "unas", "al", "del",
        "lo", "algun", "algunos", "alguna", "algunas", "ningun", "ningunos",
        "ninguna", "ningunas", "este", "esta", "estos", "estas", "ese", "esa",
        "esos", "esas", "aquel", "aquella", "aquellos", "aquellas", "su", "sus",
        "nuestro", "nuestra", "nuestros", "nuestras", "vuestro", "vuestra",
        "vuestros", "vuestras", "mi", "mis", "tu", "tus", "su", "sus", "y", "o", "pero", "porque", "aunque", "si", "como", "ya", "también",
        "además", "entonces", "así", "entonces", "sino", "sino que", "ni", "siquiera",
        "mientras", "cuando", "después", "antes", "durante", "hasta", "entre",
        "por", "para", "a", "de", "desde", "con", "sin", "en", "sobre", "tras",
        "mediante", "según", "excepto", "aun", "incluso", "inclusive", "más",
        "menos", "casi", "como si", "como si fuera", "tal como", "es decir",
        "o sea", "por ejemplo", "por lo tanto", "por lo tanto", "por consiguiente","que",
       ,"no", "se","Menu","menu","opcionEsCliente", "en otras palabras", "en conclusión", "en resumen", "al contrario", '-', ',', '.', '_', ':'
      ];
      

      // Filtrar las palabras excluidas
      todasLasPalabras = todasLasPalabras.filter(palabra => !palabrasExcluidas.includes(palabra));

    // Crear un objeto con el conteo de cada palabra
    let conteoPalabras = {};
    todasLasPalabras.forEach(palabra => {
      if (conteoPalabras[palabra]) {
        conteoPalabras[palabra]++;
      } else {
        conteoPalabras[palabra] = 1;
      }
    });

    // Crear un array de las palabras y su frecuencia, ordenado por frecuencia descendente
    let palabrasFrecuentes = [];
    for (let palabra in conteoPalabras) {
      palabrasFrecuentes.push([palabra, conteoPalabras[palabra]]);
    }
    palabrasFrecuentes.sort((a, b) => b[1] - a[1]);

    // Obtener las 10 palabras más frecuentes
    const top10PalabrasFrecuentes = palabrasFrecuentes.slice(0, 10);

    // Mostrar los resultados en la consola
    // console.log("Las 10 palabras más frecuentes son:");
    // console.log(top10PalabrasFrecuentes);
    return top10PalabrasFrecuentes;
  }

// $scope.tasaDeRespuestas = function(mensajes){

// // // Primero, filtramos los mensajes que fueron enviados por los operadores
// // const mensajesOperadores = mensajes.filter(mensaje => mensaje.estado === 0);

// // // Luego, contamos la cantidad total de mensajes enviados por los operadores
// // const cantidadMensajesOperadores = mensajesOperadores.length;

// // // A continuación, filtramos los mensajes que recibieron respuesta por parte del cliente
// // const mensajesRespondidos = mensajesOperadores.filter(mensaje => mensaje.rangoMensaje === "cliente");

// // // Y contamos la cantidad de mensajes que recibieron respuesta
// // const cantidadMensajesRespondidos = mensajesRespondidos.length;

// // // Finalmente, calculamos la tasa de respuesta como un porcentaje
// // const tasaRespuesta = cantidadMensajesRespondidos / cantidadMensajesOperadores * 100;

// // console.log(`La tasa de respuesta de los mensajes enviados por los operadores es del ${tasaRespuesta.toFixed(2)}%`);

// // Crear un objeto para almacenar la cantidad de mensajes enviados y respondidos por cada operador
// const estadisticasOperadores = {};

// // Iterar sobre cada mensaje en el arreglo
// mensajes.forEach(mensaje => {
//   // Si el mensaje fue enviado por un operador
//   if (mensaje.rangoMensaje !== 'medusa' && mensaje.rangoMensaje !== 'usuario') {
//     // Incrementar la cantidad de mensajes enviados por ese operador
//     estadisticasOperadores[mensaje.nombreUsuario] = estadisticasOperadores[mensaje.nombreUsuario] || {enviados: 0, respondidos: 0};
//     estadisticasOperadores[mensaje.nombreUsuario].enviados++;
//     console.log(estadisticasOperadores[mensaje.nombreUsuario]);
//     // Si el mensaje recibió una respuesta
//     if (mensaje.rangoMensaje === 'usuario') {
//       // Incrementar la cantidad de mensajes respondidos por ese operador
//       estadisticasOperadores[mensaje.nombreUsuario].respondidos++;
//       console.log(estadisticasOperadores[mensaje.nombreUsuario]);
//     }
//   }
// });

// // Calcular la tasa de respuesta por cada operador
// for (const operador in estadisticasOperadores) {
//   const {enviados, respondidos} = estadisticasOperadores[operador];
//   const tasaRespuesta = respondidos / enviados * 100;
//   console.log(`Tasa de respuesta para ${operador}: ${tasaRespuesta.toFixed(2)}%`);
// }



// // Crear un objeto para almacenar la cantidad de mensajes enviados y respondidos por cada área
// const estadisticasAreas = {};

// // Iterar sobre cada mensaje en el arreglo
// mensajes.forEach(mensaje => {
//   // Si el mensaje fue enviado por un operador
//   if (mensaje.estado === 0) {
//     // Incrementar la cantidad de mensajes enviados por esa área
//     estadisticasAreas[mensaje.rangoMensaje] = estadisticasAreas[mensaje.rangoMensaje] || {enviados: 0, respondidos: 0};
//     estadisticasAreas[mensaje.rangoMensaje].enviados++;

//     // Si el mensaje recibió una respuesta
//     if (mensaje.rangoMensaje !== 'medusa') {
//       // Incrementar la cantidad de mensajes respondidos por esa área
//       estadisticasAreas[mensaje.rangoMensaje].respondidos++;
//     }
//   }
// });

// // Calcular la tasa de respuesta por cada área
// for (const area in estadisticasAreas) {
//   const {enviados, respondidos} = estadisticasAreas[area];
//   const tasaRespuesta = respondidos / enviados * 100;
//   console.log(`Tasa de respuesta para el área de ${area}: ${tasaRespuesta.toFixed(2)}%`);
// }

// }


function PalabrasPorHoraEnviados(){
    
  const mensajesEnviados = mensajesEnviadosPorHora($scope.mensajes);
  
  
  const datosGrafico = [{
    x: mensajesEnviados.horas,
    y: mensajesEnviados.cantidadMensajes,
    mode: 'lines+markers',
    line: {
      color: '#adba18',
      width: 2,
      shape:'spline'
    },
    marker: {
      color: '#fff',
      size: 8,
      line: {
        color: '#fff',
        width: 1
      }
    },
    hovertemplate:"%{x}hs: %{y} msj<extra></extra>"
  }];
  
  const layoutGrafico = {
    title: '',
    xaxis: {
      title: ''
    },
    yaxis: {
      title: 'Cantidad de mensajes'
    },
  
  width: screen.width / 1.6,
  displayModeBar: false,
  plotlyConfig: {
      sizingPolicy: {
          mode: 'auto'
      }
  },
    margin: {
      l: 40,
      r: 10,
      t: 40,
      b: 50
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: '#46464686',
    font:{
      color: '#fff'
    },
    hoverlabel:{
      bgcolor: '#fff',
      font:{
        size: 25,
        color: '#000'
      }
    }
  };
  
// Dibujar el gráfico en un div con el id 'grafico'
Plotly.newPlot('mensajePorHoraEnviadosBar', datosGrafico, layoutGrafico);

}
function PalabrasPorHora(){
      const cantidadMensajesPorHora = contarMensajesPorHora($scope.mensajes);
      
      const datosGrafico = [{
        x: cantidadMensajesPorHora.horas,
        y: cantidadMensajesPorHora.cantidadMensajes,
        mode: 'lines+markers',
        line: {
          color: '#adba18',
          width: 2,
          shape:'spline'
        },
        marker: {
          color: '#fff',
          size: 8,
          line: {
            color: '#fff',
            width: 1
          }
        },
        hovertemplate:"%{x}hs: %{y} msj<extra></extra>"
      }];
      
      // Crear un objeto con la configuración del layout del gráfico
      const layoutGrafico = {
        title: '',
        xaxis: {
          title: 'Hora del día'
        },
        yaxis: {
          title: 'Cantidad de mensajes'
        },
       
      width: screen.width / 1.6,
      displayModeBar: false,
      plotlyConfig: {
          sizingPolicy: {
              mode: 'auto'
          }
      },
        margin: {
          l: 40,
          r: 10,
          t: 40,
          b: 50
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: '#46464686',
        font:{
          color: '#fff'
        },
        hoverlabel:{
          bgcolor: '#fff',
          font:{
            size: 25,
            color: '#000'
          }
        }
      };
  // Dibujar el gráfico en un div con el id 'grafico'
  Plotly.newPlot('mensajePorHoraBar', datosGrafico, layoutGrafico, );
    
  }
 
  
$scope.graficos = function(tipo){
  PalabrasPorHora();
  PalabrasPorHoraEnviados();
  pastelMensajesRecibidosPorHora();
  pastelMensajesEviadosPorHora();
  pastelOperadores();
  graficoBarrasOperadores();
  pastelEnviadosAreas();
  graficoBarrasEnviadosAreas();
  pastelconsultasRecibidasPorArea();
  graficoBarrasconsultasRecibidasPorArea();
  PalabrasfrecuentesPastel();
  palabrasFrecuentes();
  // if(tipo == 'pastel'){
  //   $scope.checkBarras = false;
  //   $scope.checkPastel = true;
   
    
  //   $scope.gridGraficos = "gridGraficos";
  // }else if(tipo = 'barras'){
  //   $scope.gridGraficos = "graficosBar";
  //   $scope.checkPastel = false;
  //   $scope.checkBarras = true;
    
    
    
    
  // }else{

  // }
  $scope.spinner = false;
  // clearTimeout($scope.grafic);
}


  //GRAFICO PASTEL**********************************
  
  function pastelMensajesEviadosPorHora(){
    const mensajesEnviados = mensajesEnviadosPorHora($scope.mensajes);
    
    var data = [{
      type: "pie",
      values: mensajesEnviados.cantidadMensajes,
      labels: mensajesEnviados.horas,
      texttemplate: `%{label}hs: %{value} msj (%{percent})`,
      textposition: "inside",
      hole: .4, // agujero central del gráfico
      textinfo: 'none',
      
    }];
    
    var layout = {
      height: 300,
      width: 300,
      showlegend: false,
      legend: {
        x: 1,
        y: 0.5
      },
      paper_bgcolor: 'rgba(0,0,0,0)', // color de fondo de la página
      plot_bgcolor: '#46464686', // color de fondo del gráfico
      font: {
        family: 'Arial, sans-serif',
        size: 14,
        color: '#fff'
      },
      margin: {
        l: 5, // margen izquierdo
        r: 5, // margen derecho
        b: 5, // margen inferior
        t: 8  // margen superior
      },
      padAngle: 1.5, // espacio entre los segmentos de la gráfica pie
      
      piecolorway: [
        '#75cac3', // verde azulado
        '#cbe0a4', // verde claro
        '#f9f586', // amarillo pálido
        '#f7b1ab', // rosa claro
        '#a6cee3', // azul claro
        '#fdbf6f', // naranja
        '#cab2d6', // morado claro
        '#b2df8a', // verde claro
        '#fb9a99', // rosa brillante
        '#e8a2ff', // violeta claro
        '#ff9e82', // naranja claro
        '#d4c4fb', // lavanda claro
        '#e0ecf4', // azul grisáceo
        '#f4cae4', // rosa pastel
        '#fed9a6', // melocotón claro
        '#bcbddc', // lavanda grisácea
        '#ccebc5', // verde pastel
        '#ffffb3', // amarillo pastel
        '#f1e2cc' // crema
      ]
    };
    

    Plotly.newPlot('mensajePorHoraEnviados', data, layout)
  }
  
  function pastelMensajesRecibidosPorHora(){
    const cantidadMensajesPorHora = contarMensajesPorHora($scope.mensajes);
    
    var data = [{
      type: "pie",
      values: cantidadMensajesPorHora.cantidadMensajes,
      labels: cantidadMensajesPorHora.horas,
      texttemplate: "%{label}hs: %{value} msj (%{percent})",
      textposition: "inside",
      hole: .4 // agujero central del gráfico

    }]
    
    var layout = {
      height: 300,
      width: 300,
      showlegend: false,
      legend: {
        x: 1,
        y: 0.5
      },
      paper_bgcolor: 'rgba(0,0,0,0)', // color de fondo de la página
      plot_bgcolor: '#46464686', // color de fondo del gráfico
      font: {
        family: 'Arial, sans-serif',
        size: 14,
        color: '#fff'
      },
      margin: {
        l: 5, // margen izquierdo
        r: 5, // margen derecho
        b: 5, // margen inferior
        t: 8  // margen superior
      },
      piecolorway: [
  '#75cac3', // verde azulado
  '#cbe0a4', // verde claro
  '#f9f586', // amarillo pálido
  '#f7b1ab', // rosa claro
  '#a6cee3', // azul claro
  '#fdbf6f', // naranja
  '#cab2d6', // morado claro
  '#b2df8a', // verde claro
  '#fb9a99', // rosa brillante
  '#e8a2ff', // violeta claro
  '#ff9e82', // naranja claro
  '#d4c4fb', // lavanda claro
  '#e0ecf4', // azul grisáceo
  '#f4cae4', // rosa pastel
  '#fed9a6', // melocotón claro
  '#bcbddc', // lavanda grisácea
  '#ccebc5', // verde pastel
  '#ffffb3', // amarillo pastel
  '#f1e2cc' // crema
]
    }

    Plotly.newPlot('mensajePorHora', data, layout)
  }

  
  function pastelEnviadosAreas(){
    
    var objCantidadArea = calculaCantidadPorArea($scope.areasFiltradas, $scope.mensajes);
    var data = [{
      type: "pie",
      values: objCantidadArea.cantidad,
      labels: objCantidadArea.area,
      texttemplate: "%{label}: %{value} msj (%{percent})",
      textposition: "inside",
      hole: .4 // agujero central del gráfico

    }]
    
    var layout = {
      height: 300,
      width: 300,
      showlegend: false,
      legend: {
        x: 1,
        y: 0.5
      },
      paper_bgcolor: 'rgba(0,0,0,0)', // color de fondo de la página
      plot_bgcolor: '#46464686', // color de fondo del gráfico
      font: {
        family: 'Arial, sans-serif',
        size: 14,
        color: '#fff'
      },
      margin: {
        l: 5, // margen izquierdo
        r: 5, // margen derecho
        b: 5, // margen inferior
        t: 8  // margen superior
      },
      piecolorway: [
  '#75cac3', // verde azulado
  '#cbe0a4', // verde claro
  '#f9f586', // amarillo pálido
  '#f7b1ab', // rosa claro
  '#a6cee3', // azul claro
  '#fdbf6f', // naranja
  '#cab2d6', // morado claro
  '#b2df8a', // verde claro
  '#fb9a99', // rosa brillante
  '#e8a2ff', // violeta claro
  '#ff9e82', // naranja claro
  '#d4c4fb', // lavanda claro
  '#e0ecf4', // azul grisáceo
  '#f4cae4', // rosa pastel
  '#fed9a6', // melocotón claro
  '#bcbddc', // lavanda grisácea
  '#ccebc5', // verde pastel
  '#ffffb3', // amarillo pastel
  '#f1e2cc' // crema
]
    }

    Plotly.newPlot('areas', data, layout)
  }

  function pastelOperadores(){
    const objCantidadOperador = calculaCantidadPorOperador($scope.empleadosFiltrados, $scope.mensajes);
    
    var data = [{
      type: "pie",
      values: objCantidadOperador.cantidad,
      labels: objCantidadOperador.operador,
      texttemplate: "%{label}: %{value} msj (%{percent})",
      textposition: "inside",
      hole: .4 // agujero central del gráfico
    }]
    
    var layout = {
      height: 300,
      width: 300,
      showlegend: false,
      legend: {
        x: 1,
        y: 0.5
      },
      paper_bgcolor: 'rgba(0,0,0,0)', // color de fondo de la página
      plot_bgcolor: '#46464686', // color de fondo del gráfico
      font: {
        family: 'Arial, sans-serif',
        size: 14,
        color: '#fff'
      },
      margin: {
        l: 5, // margen izquierdo
        r: 5, // margen derecho
        b: 5, // margen inferior
        t: 8  // margen superior
      },
      piecolorway: [
  '#75cac3', // verde azulado
  '#cbe0a4', // verde claro
  '#f9f586', // amarillo pálido
  '#f7b1ab', // rosa claro
  '#a6cee3', // azul claro
  '#fdbf6f', // naranja
  '#cab2d6', // morado claro
  '#b2df8a', // verde claro
  '#fb9a99', // rosa brillante
  '#e8a2ff', // violeta claro
  '#ff9e82', // naranja claro
  '#d4c4fb', // lavanda claro
  '#e0ecf4', // azul grisáceo
  '#f4cae4', // rosa pastel
  '#fed9a6', // melocotón claro
  '#bcbddc', // lavanda grisácea
  '#ccebc5', // verde pastel
  '#ffffb3', // amarillo pastel
  '#f1e2cc' // crema
]
    }
    
    Plotly.newPlot("operadores", data, layout);
  }

  function pastelconsultasRecibidasPorArea(){
    var data = [{
      type: "pie",
      values: $scope.consultasy,
      labels: $scope.consultasX,
      texttemplate: "%{label}: %{value} msj (%{percent})",
      textposition: "inside",
      hole: .4 // agujero central del gráfico
    }]
    
    var layout = {
      height: 300,
      width: 300,
      showlegend: false,
      legend: {
        x: 1,
        y: 0.5
      },
      paper_bgcolor: 'rgba(0,0,0,0)', // color de fondo de la página
      plot_bgcolor: '#46464686', // color de fondo del gráfico
      font: {
        family: 'Arial, sans-serif',
        size: 14,
        color: '#fff'
      },
      margin: {
        l: 5, // margen izquierdo
        r: 5, // margen derecho
        b: 5, // margen inferior
        t: 8  // margen superior
      },
      piecolorway: [
  '#75cac3', // verde azulado
  '#cbe0a4', // verde claro
  '#f9f586', // amarillo pálido
  '#f7b1ab', // rosa claro
  '#a6cee3', // azul claro
  '#fdbf6f', // naranja
  '#cab2d6', // morado claro
  '#b2df8a', // verde claro
  '#fb9a99', // rosa brillante
  '#e8a2ff', // violeta claro
  '#ff9e82', // naranja claro
  '#d4c4fb', // lavanda claro
  '#e0ecf4', // azul grisáceo
  '#f4cae4', // rosa pastel
  '#fed9a6', // melocotón claro
  '#bcbddc', // lavanda grisácea
  '#ccebc5', // verde pastel
  '#ffffb3', // amarillo pastel
  '#f1e2cc' // crema
]
    }
    
    Plotly.newPlot("consultasRecibidasPorArea", data, layout);
  }
  
  function PalabrasfrecuentesPastel(){
    var palabrasFre = calcularPalabrasFrecuentes($scope.mensajes);
    const palabras = palabrasFre.map(par => par[0]);
    const cantidad = palabrasFre.map(par => par[1]);
    var data = [{
      type: "pie",
      values: cantidad,
      labels: palabras,
      texttemplate: "%{label}: %{value} (%{percent})",
      textposition: "inside",
      hole: .4 // agujero central del gráfico
    }]
    
    var layout = {
      height: 300,
      width: 300,
      showlegend: false,
      legend: {
        x: 1,
        y: 0.5
      },
      paper_bgcolor: 'rgba(0,0,0,0)', // color de fondo de la página
      plot_bgcolor: '#46464686', // color de fondo del gráfico
      font: {
        family: 'Arial, sans-serif',
        size: 14,
        color: '#fff'
      },
      margin: {
        l: 5, // margen izquierdo
        r: 5, // margen derecho
        b: 5, // margen inferior
        t: 8  // margen superior
      },
      piecolorway: [
  '#75cac3', // verde azulado
  '#cbe0a4', // verde claro
  '#f9f586', // amarillo pálido
  '#f7b1ab', // rosa claro
  '#a6cee3', // azul claro
  '#fdbf6f', // naranja
  '#cab2d6', // morado claro
  '#b2df8a', // verde claro
  '#fb9a99', // rosa brillante
  '#e8a2ff', // violeta claro
  '#ff9e82', // naranja claro
  '#d4c4fb', // lavanda claro
  '#e0ecf4', // azul grisáceo
  '#f4cae4', // rosa pastel
  '#fed9a6', // melocotón claro
  '#bcbddc', // lavanda grisácea
  '#ccebc5', // verde pastel
  '#ffffb3', // amarillo pastel
  '#f1e2cc' // crema
]
    }
    var config = {responsive: true}
    Plotly.newPlot('palabrasFrecuentes', data, layout, config)
  }




  //*********************************************GRAFICO DE BARRAS*********************************************

  function graficoBarrasEnviadosAreas(){
    var objCantidadArea = calculaCantidadPorArea($scope.areasFiltradas, $scope.mensajes);
    // console.log(objCantidadArea);
    var data = [{
      x: objCantidadArea.area,
      y: objCantidadArea.cantidad,
      type:"bar",
      text: objCantidadArea.cantidad.map(String => String +' Mensajes enviados'),
      textposition: 'auto',
      hoverinfo: 'none',
      marker: {
        color: ['#FFC7B5', '#FFDFD3', '#B5EAD7', '#D3FFDF', '#C7B5FF', '#DFD3FF', '#FFF4E6', '#F4FFF0', '#E6E6FA', '#F0F0FF'],
        opacity: 1,
        line: {
          color: '#fff',
          width: 1.5
        }
      }
    }];
    
    var layout = {
     
      width: screen.width / 1.6,
      displayModeBar: false,
      plotlyConfig: {
          sizingPolicy: {
              mode: 'auto'
          }
      },
      margin: {
        l: 40,
        r: 10,
        t: 40,
        b: 50
      },
      title:"",
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: '#46464686',
      font:{
        color: '#fff'
      }
    };
    
    Plotly.newPlot("areasBar", data, layout);
  }

  function graficoBarrasOperadores(){
    const objCantidadOperador = calculaCantidadPorOperador($scope.empleadosFiltrados, $scope.mensajes);
    
    var data = [{
      x: objCantidadOperador.operador,
      y: objCantidadOperador.cantidad,
      type:"bar",
      text: objCantidadOperador.cantidad.map(String => String +' Mensajes enviados'),
      textposition: 'auto',
      hoverinfo: 'none',
      marker: {
        color: [
          '#75cac3', // verde azulado
          '#cbe0a4', // verde claro
          '#f9f586', // amarillo pálido
          '#f7b1ab', // rosa claro
          '#a6cee3', // azul claro
          '#fdbf6f', // naranja
          '#cab2d6', // morado claro
          '#b2df8a', // verde claro
          '#fb9a99', // rosa brillante
          '#e8a2ff', // violeta claro
          '#ff9e82', // naranja claro
          '#d4c4fb', // lavanda claro
          '#e0ecf4', // azul grisáceo
          '#f4cae4', // rosa pastel
          '#fed9a6', // melocotón claro
          '#bcbddc', // lavanda grisácea
          '#ccebc5', // verde pastel
          '#ffffb3', // amarillo pastel
          '#f1e2cc' // crema
        ],
        opacity: 1,
        line: {
          color: '#fff',
          width: 1.5
        }
      }
    }];
    
    var layout = {
      width: screen.width / 1.6,
      displayModeBar: false,
     
      margin: {
        l: 40,
        r: 10,
        t: 40,
        b: 80
      },
      title:"",
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: '#46464686',
      font:{
        color: '#fff'
      }
    };
    
    Plotly.newPlot("operadoresBar", data, layout);
  }

  function graficoBarrasconsultasRecibidasPorArea(){
    var data = [{
      x: $scope.consultasX,
      y: $scope.consultasy,
      type:"bar",
      text: $scope.consultasy.map(String => 'Consulta derivadas: '+ String ) ,
      textposition: 'auto',
      hoverinfo: 'none',
      marker: {
        color: ['#FFC7B5', '#FFDFD3', '#B5EAD7', '#D3FFDF', '#C7B5FF', '#DFD3FF', '#FFF4E6', '#F4FFF0', '#E6E6FA', '#F0F0FF'],
        opacity: 1,
        line: {
          color: '#fff',
          width: 1.5
        }
      }
    }];
    
    var layout = {
      width: screen.width / 1.6,
      displayModeBar: false,
      plotlyConfig: {
          sizingPolicy: {
              mode: 'auto'
          }
      },
      margin: {
        l: 40,
        r: 10,
        t: 40,
        b: 50
      },
      title:"",
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: '#46464686',
      font:{
        color: '#fff'
      }
    };
    
    Plotly.newPlot("consultasRecibidasPorAreaBar", data, layout);
  }
  window.addEventListener('DOMContentLoaded', function() {
    Plotly.relayout('palabrasFrecuentes', {width: window.innerWidth});
  });
  function palabrasFrecuentes(){
    var palabrasFre = calcularPalabrasFrecuentes($scope.mensajes);
    const palabras = palabrasFre.map(par => par[0]);
    const cantidad = palabrasFre.map(par => par[1]);
    // console.log(objCantidadArea);
    var data = [{
      x: palabras,
      y: cantidad,
      type:"bar",
      text: "",
      textposition: 'auto',
      hoverinfo: 'none',
      barWidth: 0.5,
      marker: {
        color: ['#FFC7B5', '#FFDFD3', '#B5EAD7', '#D3FFDF', '#C7B5FF', '#DFD3FF', '#FFF4E6', '#F4FFF0', '#E6E6FA', '#F0F0FF'],
        opacity: 1,
        line: {
          color: '#fff',
          width: 1.5
        }
      }
    }];
    
    var layout = {
     
      width: screen.width / 1.6,
      displayModeBar: false,
      plotlyConfig: {
          sizingPolicy: {
              mode: 'auto'
          }
      },
      
      margin: {
        l: 40,
        r: 10,
        t: 40,
        b: 50
      },
      title:"",
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: '#46464686',
      font:{
        color: '#fff'
      },
      
    };

   
    
    
    Plotly.newPlot("palabrasFrecuentesBar", data, layout);
  }
  $scope.areasClass = 'menuNavActive';
//ROUTES***************************
$scope.showAreas = true;
  $scope.rutasEstadisticas = function(ruta){
    
  if(ruta == 'sidebot'){
    $scope.showTiempoReal = false;
    $scope.showAreas = true;
    $window.location.href = redireccionar+'sidelink/frontend/';
    $scope.sidebotClass = 'menuNavActive';
    $scope.areasClass = 'menuNavActive';
    $scope.tiempoRealClass = '';
  }else if(ruta == 'tiempoReal'){
    $scope.showTiempoReal = true;
    $scope.showAreas = false;
    $scope.sidebotClass = '';
    $scope.areasClass = '';
    $scope.tiempoRealClass = 'menuNavActive';
   
  }else if(ruta == 'areas'){
    $scope.showTiempoReal = false;
    $scope.showAreas = true;
    $scope.sidebotClass = '';
    $scope.areasClass = 'menuNavActive';
    $scope.tiempoRealClass = '';
  }else if(ruta == 'crearDifusion'){
    $scope.estadisticasDifusion = false;
    $scope.showDifundir = false;
    $scope.showTemplateDifusion = true;
    $scope.showTemplateEncuesta = false;
    $scope.showContactos = false;
    $scope.sidebotClass = '';
    $scope.estadisticasClass = '';
    $scope.difusionClass = '';
    $scope.difusionCrearClass = 'menuNavActive';
    $scope.encuestasClass = '';
    $scope.contactosClass = '';
  }else if(ruta == 'crearEncuesta'){
    $scope.estadisticasDifusion = false;
    $scope.showDifundir = false;
    $scope.showTemplateDifusion = false;
    $scope.showTemplateEncuesta = true;
    $scope.showContactos = false;
    $scope.sidebotClass = '';
    $scope.estadisticasClass = '';
    $scope.difusionClass = '';
    $scope.difusionCrearClass = '';
    $scope.encuestasClass = 'menuNavActive';
    $scope.contactosClass = '';
  }else if(ruta == 'contactos'){
    $scope.estadisticasDifusion = false;
    $scope.showDifundir = false;
    $scope.showTemplateDifusion = false;
    $scope.showTemplateEncuesta = false;
    $scope.showContactos = true;
    $scope.sidebotClass = '';
    $scope.estadisticasClass = '';
    $scope.difusionClass = '';
    $scope.difusionCrearClass = '';
    $scope.encuestasClass = '';
    $scope.contactosClass = 'menuNavActive';
  }
}
function alerta(mensaje,status, time) {
  SnackBar({
      message: mensaje,
      dismissible: true,
      status: status,
      timeout: time,
      position: 'tr'
  });
  return false;
}
$scope.imagenNoCargada = (elementoImg) =>{
  elementoImg.src = './style/perfilVacio.png'; // Puedes establecer una imagen predeterminada
  elementoImg.alt = 'Error al cargar la imagen';
}
});