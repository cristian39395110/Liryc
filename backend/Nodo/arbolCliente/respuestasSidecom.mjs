import { Nodo } from "../nodo.mjs";
///////////////////////////////////////IMPLEMENTACION DE RESPUESTAS Y ARMADO DE ARBOL//////////////
// Construcción del árbol de respuestas

export const arbolRespuestas = new Nodo( // raiz
"raiz",
`¡Hola! Soy SIDE 👩‍🦰 tu asistente virtual de Sidecom.

Par agilizar tu consulta

*_por favor elige una opción ingresando el número correspondiente:_*
1️⃣ SOY CLIENTE
2️⃣ QUIERO SER CLIENTE`,
"hola",
false,
"",
false,
false,
false,
"",
);

const opcionEsCliente = new Nodo(
"opcionEsCliente",
`*_Por favor ingrese su número de DNI O CUIT_*`,
"1",
false,
"",
false,
true,
false,
"",
);


const opcionQuieroSerCliente = new Nodo(
"Quiero ser cliente!",
`
📡 *Derivé tu consulta a uno de nuestros representantes*
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*`,
"2",
true,
"ventas",
true,
false,
false,
"",
);

export const opcionEsClienteLogeado = new Nodo(
"opcionEsClienteLogeado",
`¿En que puedo ayudarte?

*_Por favor elige una opción ingresando el número correspondiente:_*
1️⃣ ADMINISTRACION/FACTURACION
2️⃣ VENTAS
3️⃣ SOPORTE TECNICO
`,
'logeado',
false,
'',
false,
false,
false,
''
)



const noTengoInternet = new Nodo(
"noTengoInternet",
`
👩‍💼 Bienvenido/a al departamento de *Soporte Técnico*

🔴 Recuerde veriﬁcar las conexiones de sus equipos 💻.
📶 Desenchufe el router por 5 minutos y vuelva a conectarlo.
⌚ Aguarde 5 minutos más y veriﬁque si el problema persiste o se ha solucionado.

*_Por favor, elige una opción ingresando el número correspondiente:_*
1️⃣ Consultas técnicas
2️⃣ Inconvenientes en el servicio
3️⃣ Sin servicio
4️⃣ Instalar TV Digital Sensa
5️⃣ Consultas por instalaciones o servicios pendientes.

0️⃣ Volver al menú principal`,
"3",
false,
"",
false,
false,
true,
"",
);

const consultaTecnica = new Nodo(
"Consulta tecnica",
`📌 Ingrese su consulta
Ingrese solo TEXTO para su consulta o reclamo. (No acepta audios ni imágenes)`,
"1",
false,
"",
false,
true,
false,
"",
);

const InconvenientesConElServicio = new Nodo(
"Inconvenientes con el servicio",
`📌 Comente brevemente su inconveniente
Ingrese solo TEXTO para su consulta o reclamo .(No acepta audios ni imágenes)`,
"2",
false,
"",
false,
true,
false,
"",
);

const sinServicio = new Nodo(
"Sin Servicio",
`📡 *Derivé tu consulta a uno de nuestros representantes*
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*`,
"3",
true,
"tecnico",
true,
false,
false,
"",
);

const IntalarTVDigitalSensa = new Nodo(
"Intalar TV Digital Sensa",
`
📺 Le paso un instructivo para instalar la app de TV digital SENSA 
➡️ https://www.youtube.com/watch?v=PNhLckaJzP8&t=52s&pp=ygUHc2lkZWNvbQ%3D%3D

Para generar rapidamente el usuario y contraseña te voy a pedir la marca y modelo de los 2 dispositivos en los cuales va a instalar la app de TV Digital SENSA

En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*`,
"4",
true,
"tecnico",
true,
false,
false,
"",
);

const instalacionPendiente = new Nodo(
"instalacionPendiente",
`📡 *Derivé tu consulta a uno de nuestros representantes*
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*`,
"5",
true,
"tecnico",
true,
false,
false,
"",
);


const administracion = new Nodo(
'administracion',
`
👩‍💼 Bienvenido/a al departamento administrativo.
¿En qué te puedo ayudar?

*_Por favor, elige una opción ingresando el número correspondiente:_*
1️⃣ Reenvio de factura.
2️⃣ Conocer medios de pago.
3️⃣ Informar pago.
4️⃣ Adherir a debito automático.
5️⃣ Informar promesa de pago.
6️⃣ Otras consultas

0️⃣ Volver al menú principal
`,
'1',
false,
'',
false,
false,
false,
''
);


const opcionReenvioFactura = new Nodo(
'opcionReenvioFactura',
`📡 *Derivé tu consulta a uno de nuestros representantes*
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*`,
"1",
false,
'',
false,
false,
false,
''
);

const opcionMediosDePago = new Nodo(
'opcionMediosDePago',
`📡 *Derivé tu consulta a uno de nuestros representantes*
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*`,
'2',
false,
'',
false,
false,
false,
''
);

const opcionComprobante = new Nodo(
'opcionComprobante',
`*Por favor, envie una foto de los comprobantes de pago*`,
'3',
false,
'',
false,
true,
false,
''
);

const opcionDebitoAutomatico = new Nodo(
'opcionDebitoAutomatico',
`📡 *Derivé tu consulta a uno de nuestros representantes*
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*`,
"4",
true,
"cobranza",
true,
false,
false,
"",
);

const opcionPromesaDePago = new Nodo(
'opcionPromesaDePago',
`📡 *Derivé tu consulta a uno de nuestros representantes*
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*`,
"5",
true,
"cobranza",
true,
false,
false,
"",
);


const opcionConsultasAdministracion = new Nodo(
'opcionConsultasAdministracion',
`📡 *Derivé tu consulta a uno de nuestros representantes*
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*`,
"6",
true,
"cobranza",
true,
false,
false,
"",
);

const ventasLogeado = new Nodo(
'ventasLogeado',
`📡 *Derivé tu consulta a uno de nuestros representantes*
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*
`,
'2',
true,
'ventas',
false,
false,
false,
''
);

// const ventaSensa = new Nodo(
// "ventaSensa",
// `📡 *Derivé tu consulta a uno de nuestros representantes*
// En minutos se pondrán en contacto con vos!
// 🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*`,
// "1",
// true,
// "ventas",
// true,
// false,
// false,
// "",
// );

// const ventaInternet = new Nodo(
// "ventaInternet",
// `📡 *Derivé tu consulta a uno de nuestros representantes*
// En minutos se pondrán en contacto con vos!
// 🙆‍♀️ ¡Gracias por elegirnos! *Te saluda tu asistente, SIDE 👩‍🦰*`,
// "2",
// true,
// "ventas",
// true,
// false,
// false,
// "",
// );
export const noEncuentraDNI = `*Estoy teniendo algunos problemas para encontrar tu número de documento.*
  *Para asegurarte la mejor atención, te voy a derivar a un operador para que pueda asistirte.*
  
  *En minutos se pondrán en contacto con vos!*
  *Te saluda tu asistente virtual de sidecom 👩‍🦰*`

export const encuentraDNIMensaje = cliente => { 
return `*Hola ${cliente.name}!*
El estado de su cuenta es: *${cliente.debt !== '0.00' ? '$'+cliente.debt : '$'+cliente.duedebt}*
El estado de tu servicio es: *${cliente.status === 'enabled' ? 'Conectado ✅' : cliente.status === 'blocked' ? 'Suspendido por falta de pago ⛔' : 'Sin conexion ❌'}*`
}

arbolRespuestas.addOpcion(opcionEsCliente);
arbolRespuestas.addOpcion(opcionQuieroSerCliente);

arbolRespuestas.addOpcion(opcionEsClienteLogeado);
// opcionEsClienteLogeado.addOpcion(opcionCobranza);
// opcionEsClienteLogeado.addOpcion(opcionSoporteTecnico);



opcionEsClienteLogeado.addOpcion(noTengoInternet);
opcionEsClienteLogeado.addOpcion(ventasLogeado);
opcionEsClienteLogeado.addOpcion(administracion);

administracion.addOpcion(opcionMediosDePago);
administracion.addOpcion(opcionComprobante);
administracion.addOpcion(opcionReenvioFactura);
administracion.addOpcion(opcionDebitoAutomatico);
administracion.addOpcion(opcionPromesaDePago);
administracion.addOpcion(opcionConsultasAdministracion);

// ventasLogeado.addOpcion(ventaSensa);
// ventasLogeado.addOpcion(ventaInternet);

noTengoInternet.addOpcion(consultaTecnica);
noTengoInternet.addOpcion(InconvenientesConElServicio);
noTengoInternet.addOpcion(sinServicio);
noTengoInternet.addOpcion(IntalarTVDigitalSensa);
noTengoInternet.addOpcion(instalacionPendiente);
