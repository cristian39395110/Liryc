import fs from 'node:fs'
export const guardarArchivo = (ruta, archivo, nombre) =>{
  try{
    fs.writeFile( //ESCRIBE EL ARCHIVO EN LA CARPETA ./subir 
    ruta+nombre,
    archivo,
    "base64",
    function (err) {
      if (err) {
        return console.log(err + "error al escribir el archivo");
      }
    }
  );   
}catch(err){
  return console.log(err, "error al guardarArchivo");
}   
}