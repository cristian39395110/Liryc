import { Nodo } from "../nodo.mjs";
///////////////////////////////////////IMPLEMENTACION DE RESPUESTAS Y ARMADO DE ARBOL//////////////
// Construcción del árbol de respuestas

export const arbolRespuestas = new Nodo(
  "raiz",
  `🤖 ¡Hola! Soy Medusa de Ruvik  \n` +
    "Estoy aquí para ayudarte. ¿En qué puedo ayudarte hoy?\n" +
    "Por favor, elige una opción ingresando el número correspondiente:\n\n" +
    "1- Quiero saber más acerca de Ruvik y Medusa \n" +
    "2- Quiero que un representante se contacte conmigo\n",
  "hola",
  false,
  "",
  false,
  false,
  false,
  ""
);

const opcionRuvik = new Nodo(
  "ruvik",
  `En *Ruvik* desarrollamos software de comunicación a medida. Nuestra visión es clara: la accesibilidad a la automatización es la clave del presente.
    
    *Medusa* es una plataforma de atención al cliente que funciona a través de whatsapp. Su principal función es centralizar las consultas de los clientes en un único canal. Cuenta con un asistente virtual inteligente diseñado para resolver consultas automáticamente, dando respuestas o recopilando datos y, cuando sea necesario, derivando las conversaciones a las personas adecuadas. Ofrece estadísticas valiosas, un módulo para programar envío de mensajes, encuestas, seguimientos y más.
    
    _Por favor, elige una opción ingresando el número correspondiente_:
    1- Quiero conocer más sobre Medusa.
    0- Volver al menú principal.
    `,
  "1",
  false,
  "",
  false,
  false,
  false,
  ""
);

const opcionSaberMas = new Nodo(
  "saberMas",
  `¡Excelente! Hay muchas cosas interesantes que puedo contarte.
    
    _Por favor, elige una opción ingresando el número correspondiente_:
    1- Si deseas saber qué ocurre al solicitar un representante.
    2- Si deseas una demostración de cómo funciona nuestro servicio.
    3- Si quieres aprender cómo se instala y utiliza nuestra plataforma.
    4- Si deseas conocer el precio de nuestros servicios.
    0- Volver al menu principal
    `,
  "1",
  false,
  "",
  false,
  false,
  false,
  ""
);

const opcionOcurreSolicitarRepre = new Nodo(
  "OcurreSolicitarRepre",
  `Cuando un cliente solicita un representante, Medusa se encarga de derivarlo al área correspondiente y envía un mensaje que le indica que ha sido derivado.
    Por otro lado el operador a cargo, recibe un mensaje en su chat (nuestra interfaz), notificándole sobre la solicitud de asistencia del cliente y proporcionándole la información que el cliente haya brindado hasta ese momento sobre su consulta.
    
    Si usted se encuentra con un representante a su lado, podemos realizar una demostración en este mismo momento. ¿Le interesa?
    
    _Por favor, elige una opción ingresando el número correspondiente_:
      
    1- Sí, estoy con un representante a mi lado.
    0- Volver al menu principal
    `,
  "1",
  false,
  "",
  false,
  false,
  false,
  ""
);

const opcionDemostracion = new Nodo(
  "Demostracion",
`Su consulta fue derivada a un representante.
Nos pondremos en contacto a la brevedad para coordinar una demostracion en vivo`,
  "2",
  true,
  "admin",
  true,
  false,
  false,
  ""
);

const opcionInstalaUtiliza = new Nodo(
  "InstalaUtiliza",
`La instalación de Medusa es local, en una computadora del cliente, y la realizan los técnicos de Ruvik de manera remota, posiblemente asistidos por un representante de manera presencial.
Su uso es similar al de Whatsapp web, y su interfaz está diseñada para parecerse lo más posible.
    
  _Por favor, elige una opción ingresando el número correspondiente_:
  
  0- Volver al menu principal
    `,
  "3",
  false,
  "",
  true,
  false,
  false,
  ""
);

const opcionPrecio = new Nodo(
  "Precio",
`Medusa es una solución personalizada, que se adapta a las necesidades y presupuesto de tu empresa. Es por esto que el precio será diferente cada caso.
Enviamos tu consulta a un representante para que se contacte con usted por una cotización a la brevedad.`,
  "4",
  true,
  "admin",
  true,
  false,
  false,
  ""
);

const opcionMotivoConsulta = new Nodo(
"MotivoConsulta",
`*Seleccione un motivo de consulta de ejemplo:*
  
  1- Quiero agendar un turno
  2- Busco alquilar un departamento
  3- Quiero reclamar por mi comida
  4- No me funciona internet`,
  "1",
  false,
  "",
  false,
  false,
  true,
  ""
);

const opcionObtenerDatos1 = new Nodo(
  "ObtenerDatos1",
  `_A modo de ejemplo_ ingrese: *NOMBRE* *APELLIDO* *DNI* (no hace falta que sea real)`,
  "1",
  false,
  "",
  false,
  true,
  false,
  ""
);

const opcionObtenerDatos2 = new Nodo(
  "ObtenerDatos2",
  `_A modo de ejemplo_ ingrese: *NOMBRE* *APELLIDO* *DNI* (no hace falta que sea real)`,
  "2",
  false,
  "",
  false,
  true,
  false,
  ""
);
const opcionObtenerDatos3 = new Nodo(
  "ObtenerDatos3",
  `_A modo de ejemplo_ ingrese: *NOMBRE* *APELLIDO* *DNI* (no hace falta que sea real)`,
  "3",
  false,
  "",
  false,
  true,
  false,
  ""
);
const opcionObtenerDatos4 = new Nodo(
  "ObtenerDatos4",
  `_A modo de ejemplo_ ingrese: *NOMBRE* *APELLIDO* *DNI* (no hace falta que sea real)`,
  "4",
  false,
  "",
  false,
  true,
  false,
  ""
);

const opcionOperador = new Nodo(
  "operador",
  `_Por favor, elige una opción ingresando el número correspondiente:_
    1- Quiero solicitar sus servicios
    2- Necesito soporte técnico
    0- Volver al menu principal`,
  "2",
  false,
  "",
  false,
  false,
  false,
  ""
);

const opcionDerivadoTecnico = new Nodo(
  "derivadoTecnico",
  `Derivé tu consulta al departamento tecnico.
    Nos comunicaremos contigo a la brevedad. Saludos!`,
  "2",
  true,
  "admin",
  true,
  false,
  false,
  ""
);

const opcionDerivadoServicio = new Nodo(
  "derivadoServicio",
  `Derivé tu consulta al departamento de ventas.
    Nos comunicaremos contigo a la brevedad. Saludos!`,
  "1",
  true,
  "admin",
  true,
  false,
  false,
  ""
);

arbolRespuestas.addOpcion(opcionRuvik); // Opción 1: ruvik
arbolRespuestas.addOpcion(opcionOperador); // Opción 2: deriva a operador

opcionOperador.addOpcion(opcionDerivadoTecnico); // Opción 1: derivadoTecnico
opcionOperador.addOpcion(opcionDerivadoServicio); // Opción 2: opcionDerivadoServicio

opcionRuvik.addOpcion(opcionSaberMas); //opcion 1: saberMas
opcionSaberMas.addOpcion(opcionOcurreSolicitarRepre); //opcion 1: opcionOcurreSolicitarRepre
opcionSaberMas.addOpcion(opcionDemostracion); //opcion 2: Demostracion
opcionSaberMas.addOpcion(opcionInstalaUtiliza); //opcion 3: opcionInstalaUtiliza
opcionSaberMas.addOpcion(opcionPrecio); //opcion 4: opcionPrecio

opcionOcurreSolicitarRepre.addOpcion(opcionMotivoConsulta);
opcionMotivoConsulta.addOpcion(opcionObtenerDatos1);
opcionMotivoConsulta.addOpcion(opcionObtenerDatos2);
opcionMotivoConsulta.addOpcion(opcionObtenerDatos3);
opcionMotivoConsulta.addOpcion(opcionObtenerDatos4);
// Más nodos y opciones del árbol de respuestas...
// Puedes continuar construyendo el árbol de respuestas agregando más nodos y opciones según tus necesidades.
