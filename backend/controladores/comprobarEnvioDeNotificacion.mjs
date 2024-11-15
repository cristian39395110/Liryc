import updateEnviadoNotify from "./updateEnviadoNotify.mjs"

export default (arContactos, con, client) => {
  const intervalo = 5000;
  const horaActual = new Date();
  arContactos.forEach((value, index) => {
    setTimeout(() => {
      let fechaBaseDatos = new Date(value.fecha);
      if (
        horaActual.getTime() >= fechaBaseDatos.getTime() &&
        Number(value.enviado) === 0
      ) {
        // Lógica para enviar el mensaje

        client.sendMessage(value.telefono, value.mensaje);
        //console.log(value.telefono, value.mensaje, "mensaje a enviar");
        // Actualiza el estado enviado en la base de datos
        updateEnviadoNotify(value.idNotify, con, client);
      }
    }, index * intervalo);
  });
};
