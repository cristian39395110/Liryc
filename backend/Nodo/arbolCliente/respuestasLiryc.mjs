import { Nodo } from "../nodo.mjs";
///////////////////////////////////////IMPLEMENTACION DE RESPUESTAS Y ARMADO DE ARBOL//////////////
// Construcción del árbol de respuestas

export const arbolRespuestas = new Nodo( // raiz
  "raiz",
  `¡Hola! 
Soy la asistente virtual de Lliryc, Para agilizar tu consulta:

por favor elige una opción ingresando el número correspondiente:
1️⃣ SOY CLIENTE
2️⃣ QUIERO SER CLIENTE`,
  "hola",
  false,
  "",
  false,
  true,
  false,
  ""
);
const opcionEsCliente = new Nodo(
"opcionEsCliente",
`
buenos dias dias gracias por comunicarse con lLliryc SRL

*_para continuar ingrese el Dni del titular_*`,
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
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Lliryc 👩‍🦰  `,
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
3️⃣ ADMINISTRACION/FACTURACION
4️⃣ ASISTENCIA VIRTUAL AUTOGESTIÓN`,
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
4️⃣ Consultas por instalaciones o servicios pendientes
5️⃣ Instalar TV Digital Sensa
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
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Lliryc 👩‍🦰`,
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
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Lliryc 👩‍🦰`,
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
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Lliryc 👩‍🦰`,
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
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Lliryc 👩‍🦰`,
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
"5",
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
"4",
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

export const principalMenu = `👩‍🦰 ¿Te puedo ayudar en algo más?

1️⃣ Reenvio de factura.
2️⃣ Conocer medios de pago.
3️⃣ Informar pago.
4️⃣ Informar promesa de pago.
5️⃣ Adherir a debito automático.
6️⃣ Otras consultas

0️⃣ Volver al menú principal` 
export const principalMenuAsistenteVirtual = `🤖 ¿Te puedo ayudar en algo más?

Por favor, elige una opción ingresando el número correspondiente:
1️⃣ Reenvio de factura.
2️⃣ Conocer medios de pago.
3️⃣ Informar pago.
4️⃣ Informar promesa de pago.
5️⃣ Instalar TV Digital Sensa

0️⃣ Volver al menú principal` 
export const menuPrincipal = `👩‍🦰 ¿En que puedo ayudarte?

Por favor elige una opción ingresando el número correspondiente:
1️⃣ SOPORTE TECNICO
2️⃣ VENTAS
3️⃣ ADMINISTRACION/FACTURACION
4️⃣ ASISTENCIA VIRTUAL AUTOGESTIÓN`   


const administracion = new Nodo(
'administracion',
`
👩‍💼 Bienvenido/a al departamento administrativo.
¿En qué te puedo ayudar?

Por favor, elige una opción ingresando el número correspondiente:
1️⃣ Reenvio de factura.
2️⃣ Conocer medios de pago.
3️⃣ Informar pago.
4️⃣ Hacer promesa de pago
5️⃣ Otras Preguntas

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
const     segundaAdministracion = new Nodo(
  'segundaAdministracion',
  `
  
👩‍🦰 ¿En qué más te puedo ayudar?

Por favor, elige una opción ingresando el número correspondiente:
1️⃣ Reenvio de factura.
2️⃣ Conocer medios de pago.
3️⃣ Informar pago.
4️⃣ Informar promesa de pago.
5️⃣ Adherir a debito automático.
6️⃣ Otras consultas

0️⃣ Volver al menú principal
  `,
  '777',
  false,
  '',
  false,
  false,
  false,
  ''
  );
  
  const otrasConsultas = new Nodo(
    'otrasConsultas',
    `📡 Derivé tu consulta a uno de nuestros representantes
    En minutos se pondrán en contacto con vos!
    🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente, de Lliryc 👩‍🦰`,
    "6",
    true,
    "tecnico",
    true,
    false,
    false,
    "",
    );

    const adherirDebito = new Nodo(
      'adherirDebito',
      `📡 Derivé tu consulta a uno de nuestros representantes
      Para que gestione su pago a debito automatico`,
      "5",
      true,
      "tecnico",
      true,
      false,
      false,
      "",
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
5️⃣ Adherir a debito automático.
6️⃣ Otras consultas`,
'2',
false,
'',
false,
false,
false,
''
);

const opcionMediosDePagoAsistenteVirtual = new Nodo(
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
5️⃣ Instalar TV Digital Sensa

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
true,
'',
true,
false,
false,
''
);


const opcionPromesaDePago = new Nodo(
'opcionPromesaDePago',
`📡 Derivé tu consulta a uno de nuestros representantes
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente, de Lliryc 👩‍🦰`,
"4",
false,
"",
false,
false,
false,
"",
);

const opcionConsultasAdministracion = new Nodo(
'opcionConsultasAdministracion',
`📡 Derivé tu consulta a uno de nuestros representantes
En minutos se pondrán en contacto con vos!
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente, de Lliryc 👩‍🦰`,
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
🙆‍♀️ ¡Gracias por elegirnos! Te saluda tu asistente de Lliryc 👩‍🦰*
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
  *Te saluda tu asistente virtual de Lliryc 👩‍🦰*`

export const encuentraDNIMensaje = cliente => { 
return `*Hola ${cliente.name}!*
El estado de su cuenta es: *${cliente.debt !== '0.00' ? '$'+cliente.debt : '$'+cliente.duedebt}*
El estado de tu servicio es: *${cliente.status === 'enabled' ? 'Conectado ✅' : cliente.status === 'blocked' ? 'Suspendido por falta de pago ⛔' : 'Sin conexion ❌'}*`
}


///////////////Nodos EDUARDO//////////////////////////////////////////////////////
export const tecnicoLogeado = new Nodo(
  "tecnicoLogeado",
  `Bienvenido`,
  "opciontecnico",
  false,
  "",
  false,
  false,
  true,
  ""
);
export const tecnicoLogeadoOpcion1 = new Nodo(
  "tecnicoLogeadoOpcion1",
  `Por favor, ingrese los datos del cliente en el siguiente orden:

1️⃣ *Nombre Completo*`,
  "1",
  false,
  "",
  false,
  true,
  false,
  ""
);
export const tecnicoLogeadoDireccion = new Nodo(
  "tecnicoLogeadoDireccion",
  `2️⃣ *Dirección*`,
  "2",
  false,
  "",
  false,
  true,
  false,
  ""
);
export const tecnicoLogeadoTelefono = new Nodo(
  "tecnicoLogeadoTelefono",
  `3️⃣ *Teléfono Principal*`,
  "3",
  false,
  "",
  false,
  true,
  false,
  ""
);
export const tecnicoLogeadoTelefono2 = new Nodo(
  "tecnicoLogeadoTelefono2",
 `4️⃣ *Teléfono Secundario (opcional)*`,
  "4",
  false,
  "",
  false,
  true,
  false,
  ""
);
export const tecnicoLogeadoEmail = new Nodo(
  "tecnicoLogeadoEmail",
 `5️⃣ *Correo Electrónico*`,
  "5",
  false,
  "",
  false,
  true,
  false,
  ""
);
export const tecnicoLogeadoPlan = new Nodo(
  "tecnicoLogeadoPlan",
 `6️⃣ *Plan Seleccionado*`,
  "6",
  false,
  "",
  true,
  true,
  false,
  ""
);



export const tecnicoLogeadoOpcion2 = new Nodo(
  "tecnicoLogeadoOpcion2",
  `Por favor, proporcione los siguientes datos para completar el proceso:

1️⃣- 📶 Nombre de la Red WiFi`,
  "2",
  false,
  "",
  false,
  true,
  false,
  ""
);
export const tecnicoLogeadoRedWifi = new Nodo(
  "tecnicoLogeadoRedWifi",
  `2️⃣- 🔑 Contraseña de la Red WiFi`,
  "3",
  false,
  "",
  false,
  true,
  false,
  ""
);
export const tecnicoLogeadoPassWifi = new Nodo(
  "tecnicoLogeadoPassWifi",
  `3️⃣- 📸 Foto de MAC`,
  "4",
  false,
  "tecnico",
  false,
  true,
  false,
  ""
);
export const tecnicoLogeadoDatosCargados = new Nodo(
  "tecnicoLogeadoDatosCargados",
  `✅ Los datos de conexión se han almacenado correctamente en el sistema.`,
  "5",
  true,
  "tecnico",
  true,
  true,
  false,
  ""
);
export const asistenteVirtual = new Nodo(
  "administracion",
  `🤖 ¡Bienvenido/a! Soy tu Asistente Virtual. 
¿En qué te puedo ayudar?

Por favor, elige una opción ingresando el número correspondiente:
1️⃣ Reenvio de factura.
2️⃣ Conocer medios de pago.
3️⃣ Informar pago.
4️⃣ Informar promesa de pago.
5️⃣ Instalar TV Digital Sensa

0️⃣ Volver al menú principal
`,
  "4",
  false,
  "",
  false,
  false,
  true,
  ""
);
 arbolRespuestas.addOpcion(tecnicoLogeado);
 tecnicoLogeado.addOpcion(tecnicoLogeadoOpcion1);
tecnicoLogeadoOpcion1.addOpcion(tecnicoLogeadoDireccion);
tecnicoLogeadoDireccion.addOpcion(tecnicoLogeadoTelefono);
tecnicoLogeadoTelefono.addOpcion(tecnicoLogeadoTelefono2);
tecnicoLogeadoTelefono2.addOpcion(tecnicoLogeadoEmail)
tecnicoLogeadoEmail.addOpcion(tecnicoLogeadoPlan)

tecnicoLogeado.addOpcion(tecnicoLogeadoOpcion2)
tecnicoLogeadoOpcion2.addOpcion(tecnicoLogeadoRedWifi)
tecnicoLogeadoRedWifi.addOpcion(tecnicoLogeadoPassWifi)
tecnicoLogeadoPassWifi.addOpcion(tecnicoLogeadoDatosCargados)

opcionEsClienteLogeado.addOpcion(asistenteVirtual)
asistenteVirtual.addOpcion(opcionReenvioFactura)
asistenteVirtual.addOpcion(opcionMediosDePagoAsistenteVirtual)
asistenteVirtual.addOpcion(opcionComprobante)
asistenteVirtual.addOpcion(opcionPromesaDePago)
asistenteVirtual.addOpcion(IntalarTVDigitalSensa)



//arbolRespuestas.addOpcion(opcionEsCliente);
//arbolRespuestas.addOpcion(opcionQuieroSerCliente);

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
administracion.addOpcion(segundaAdministracion);




segundaAdministracion.addOpcion(opcionMediosDePago);
segundaAdministracion.addOpcion(opcionComprobante);
segundaAdministracion.addOpcion(opcionReenvioFactura);
segundaAdministracion.addOpcion(opcionPromesaDePago);
segundaAdministracion.addOpcion(adherirDebito);
segundaAdministracion.addOpcion(otrasConsultas);


// ventasLogeado.addOpcion(ventaSensa);
// ventasLogeado.addOpcion(ventaInternet);

noTengoInternet.addOpcion(consultaTecnica);
noTengoInternet.addOpcion(InconvenientesConElServicio);
noTengoInternet.addOpcion(sinServicio);
noTengoInternet.addOpcion(IntalarTVDigitalSensa);
noTengoInternet.addOpcion(instalacionPendiente);
InconvenientesConElServicio.addOpcion(DerivaInconvenientesConElServicio);// caso 2

consultaTecnica.addOpcion(consultaSinServicio);// caso 1
consultaSinServicio.addOpcion(DerivaconsultaSinServicio);//caso 1


sinServicio.addOpcion(ArraydeServicio);
ArraydeServicio.addOpcion(DerivaArraydeServicio);


//consultaSinServicio.addOpcion(DerivaconsultaSinServicio);

//sinServicio.addOpcion(ServicioDeriva);