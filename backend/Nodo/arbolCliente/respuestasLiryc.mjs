import { Nodo } from "../nodo.mjs";
///////////////////////////////////////IMPLEMENTACION DE RESPUESTAS Y ARMADO DE ARBOL//////////////
// Construcción del árbol de respuestas

export const arbolRespuestas = new Nodo( // raiz
"raiz",
`¡Hola! 
Soy la asistente virtual de Nuevanet, Para agilizar tu consulta:

*_por favor elige una opción ingresando el número correspondiente:_*
1️⃣ SOY CLIENTE
2️⃣ QUIERO SER CLIENTE`,
"hola",
false,
"",
false,
true,
false,
"",
);

export const opcionEsCliente = new Nodo(
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
📡 Derivé tu consulta a uno de nuestros representantes
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Nuevanet 👩‍🦰  `,
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
`
¿En que puedo ayudarte?

por favor elige una opción ingresando el número correspondiente:
1️⃣ SOPORTE TECNICO
2️⃣ VENTAS
3️⃣ ADMINISTRACION/FACTURACION`,
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
0️⃣ Volver al menú principal`,
"1",
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
"InconvenientesConElServicio",
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
const DerivaInconvenientesConElServicio = new Nodo(
  "DerivaInconvenientesConElServicio",
  `📡 Derivé tu consulta a uno de nuestros representantes
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Nuevanet 👩‍🦰`,
  "1",
  true,
  "tecnico",
  true,
  false,
  false,
  "",
  );
  

const sinServicio = new Nodo(
"sinServicio",
`Por favor indícanos con que servicio contas en tu domicilio.
1️⃣ Fibra Óptica
2️⃣ Antena`,
"3",
false,
"",
false,
false,
true,
"",
);

const ArraydeServicio = new Nodo(
  "usuario fibra o antena",
  `📌 Ingrese su consulta
Ingrese solo TEXTO para su consulta o reclamo. (No acepta audios ni imágenes)`,
  ["1","2"],
  false,
  "",
  false,
  true,
  false,
  "",
  );
  const DerivaArraydeServicio = new Nodo(
    "DerivaArraydeServicio",
    `📡 Derivé tu consulta a uno de nuestros representantes
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Nuevanet 👩‍🦰`,
    "1",
    true,
    "tecnico",
    true,
    false,
    true,
    "",
    );
const consultaSinServicio = new Nodo(
  "consultaSinServicio",
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
  const DerivaconsultaSinServicio = new Nodo(
    "DerivaconsultaSinServicio",
    `📡 Derivé tu consulta a uno de nuestros representantes
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Nuevanet 👩‍🦰`,
    "1",
    true,
    "tecnico",
    true,
    true,
    false,
    "",
    );

const ServicioDeriva = new Nodo(
  "ServicioDeriva",
  `📡 Derivé tu consulta a uno de nuestros representantes
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Nuevanet 👩‍🦰`,
  "1",
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
export const muestraFactura = obj => {
  return `🧾 Le enviamos a continuación el detalle de su ultima factura.
${obj}`
}

export const errorNoEncuentraFactura = `🧾 *Lamentablementente no pude encontrar tu ultima factura. *`

export const menuVolver = `👩‍🦰 ¿Te puedo ayudar en algo más?

Por favor, elige una opción ingresando el número correspondiente:
1️⃣ Reenvio de factura.
2️⃣ Conocer medios de pago.
3️⃣ Informar pago.
4️⃣ Informar promesa de pago.
5️⃣ Otras consultas

0️⃣ Volver al menú principall` 

export const menuPrincipal = `👩‍🦰 ¿En que puedo ayudarte?

por favor elige una opción ingresando el número correspondiente:
1️⃣ SOPORTE TECNICO
2️⃣ VENTAS
3️⃣ ADMINISTRACION/FACTURACION`   


const   administracion = new Nodo(
'administracion',
`
👩‍💼 Bienvenido/a al departamento administrativo.
¿En qué te puedo ayudar?

*_Por favor, elige una opción ingresando el número correspondiente:_*
1️⃣ Reenvio de factura.
2️⃣ Conocer medios de pago.
3️⃣ Informar pago.
4️⃣ Informar promesa de pago.
5️⃣  Otras consultas

0️⃣ Volver al menú principal
`,
'3',
false,
'',
false,
false,
false,
''
);


const opcionReenvioFactura = new Nodo(
'facturacion',
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
`🏦 Su alias para hacer depósitos/transferencias en Siro es:
{ALIAS DE SIRO}
🚫 Recuerde que este alias es personal e intransferible.

También puede realizar pagos en Rapipago y Pago Fácil presentando su factura.

👩‍🦰 ¿En qué más te puedo ayudar?

Por favor, elige una opción ingresando el número correspondiente:
1️⃣ Reenvio de factura.
2️⃣ Conocer medios de pago.
3️⃣ Informar pago.
4️⃣ Informar promesa de pago.
5️⃣ Otras consultas

0️⃣ Volver al menú principal`,
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
'true'
);


const opcionPromesaDePago = new Nodo(
'opcionPromesaDePago',
`📡 Derivé tu consulta a uno de nuestros representantes
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente, de Nuevanet 👩‍🦰`,
"4",
true,
"tecnico",
true,
false,
false,
"",
);

const opcionConsultasAdministracion = new Nodo(
'opcionConsultasAdministracion',
`📡 Derivé tu consulta a uno de nuestros representantes
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente, de Nuevanet 👩‍🦰`,
"5",
true,
"tecnico",
true,
false,
false,
"",
);

const ventasLogeado = new Nodo(
'ventasLogeado',
`
📡 Derivé tu consulta a uno de nuestros representantes
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Nuevanet 👩‍🦰*
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
  *Te saluda tu asistente virtual de Nuena Net 👩‍🦰*`

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
administracion.addOpcion(opcionPromesaDePago);
administracion.addOpcion(opcionConsultasAdministracion);



// ventasLogeado.addOpcion(ventaSensa);
// ventasLogeado.addOpcion(ventaInternet);

noTengoInternet.addOpcion(consultaTecnica);
noTengoInternet.addOpcion(InconvenientesConElServicio);
noTengoInternet.addOpcion(sinServicio);


InconvenientesConElServicio.addOpcion(DerivaInconvenientesConElServicio);// caso 2


consultaTecnica.addOpcion(consultaSinServicio);// caso 1
consultaSinServicio.addOpcion(DerivaconsultaSinServicio);//caso 1


sinServicio.addOpcion(ArraydeServicio);
ArraydeServicio.addOpcion(DerivaArraydeServicio);


//consultaSinServicio.addOpcion(DerivaconsultaSinServicio);

//sinServicio.addOpcion(ServicioDeriva);




