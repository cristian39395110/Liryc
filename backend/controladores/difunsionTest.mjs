export default (mensaje, contactos, numero, client) => {
  var sum = 0;
  contactos = [];
  contactos = [{ telefono: numero }];
  contactos.forEach((element) => {
    sum = sum + 3000;
    element.telefono = element.telefono.replace(/-/g, ""); // guion
    element.telefono = element.telefono.replace(/ /g, ""); // espacios
    if (element.telefono.includes("+")) {
      element.telefono = element.telefono.replace("+", "");
      element.telefono = element.telefono;
    }
    if (!element.telefono.startsWith("549")) {
      element.telefono = "549" + element.telefono;
    }
    if (!element.telefono.includes("@c.us")) {
      element.telefono = element.telefono + "@c.us";
    }
    setTimeout(function () {
      console.log(element.telefono.length);
      console.log(element.telefono);

      client.sendMessage(element.telefono, mensaje.mensaje);
      console.log(mensaje);
    }, sum);
    if (contactos.length * 3000 === sum) {
      console.log("termino la difusion test");
    }
    //  clearTimeout() investigar****
  });
};
