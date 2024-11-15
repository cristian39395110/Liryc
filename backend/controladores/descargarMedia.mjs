//nombreMedia = nombre del archivo
//path = ruta del archivo
import fs from'node:fs' // file system
export default async (message, path) => { //FUNCION PARA DESCARGAR UNA IMAGEN
    var attachmentData = await message.downloadMedia();
    if(attachmentData.data !== undefined){
        fs.writeFile( //ESCRIBE EL ARCHIVO EN LA CARPETA 
        path,
        attachmentData.data,
        "base64",
        function (err) {
          if (err) {
            console.log(err + "error al escribir el archivo");
          }
        }
      );
    }else{
      console.log("error al leer archivo");
    }
}