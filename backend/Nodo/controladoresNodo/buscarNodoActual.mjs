import con from "../../database/conexion.mjs";

export function buscarNodoActual(telefono) {
  return new Promise((resolve, reject) => {
    var exiteUsuario = "SELECT menu, numero, datos, opcion, instancia, menuFinal, otros FROM menucliente WHERE telefono = '" + telefono + "'";
    
    con.query(exiteUsuario, function (err, result) {
      if (err) {
        // En caso de error, rechazamos la promesa
        reject("Error en buscarNodoActual: " + err);
      }
      
      if (result.length > 0) {
        // Si encontramos un resultado, resolvemos la promesa con el menú encontrado
        resolve({
          menu: result[0].menu,
          numero: result[0].numero,
          datos: result[0].datos,
          opcion: result[0].opcion,
          instancia: result[0].instancia,
          menuFinal: result[0].menuFinal,
          otros: result[0].otros
        });
      } else {
        // Si no se encuentra el menú, devolvemos null
        resolve(null);
      }
    });
  });
}
