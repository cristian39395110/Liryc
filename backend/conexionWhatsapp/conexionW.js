const qrcode = require("qrcode-terminal"); // ver qr por consola
const {
  Client,
  LocalAuth,
  Product,
  Buttons,
  MessageMedia,
  List,
} = require("whatsapp-web.js"); // importa las librerias de whatsapp
// const client = new Client({
//   // crea un cliente de whatsapp
//   authStrategy: new LocalAuth(),
// });
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false,
    executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",
  }
});
const EnlazarBot = (colors, esPrimeraVez) => {
  if(esPrimeraVez === "subirImagen"){
    return MessageMedia
  }
  if (esPrimeraVez) {
    client.initialize();

    client.on("qr", (qr) => {
      // RECIBE EL CODIGO QR
      console.log("estoy en qr");
      qrcode.generate(qr, { small: true });
    });
    try {
      client.on("ready", () => {
        // CUANDO WSP ESTA ENLAZADO Y LISTO PARA USAR
        console.log(
          colors.cyan(
            "\rBot enlazado y listo para usar!"
          )
        );
      });
    } catch (err) {
      console.log(err);
    }

    return client;
  } else {
    return client;
  }
  

};

module.exports = EnlazarBot;
