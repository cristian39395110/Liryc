import conexion from "../database/conexion.mjs";
import colors from "colors/safe.js";
export async function rutinaBuscaForoPerfil(client) {
    
    var sql = "select telefono from contactos where urlPerfil != ''";
    var guardarSql = "UPDATE contactos SET urlPerfil = ? WHERE ? = telefono";
    conexion.query(sql, async (err, result) => {
        let arTelefonos = result;
      
        for await(let telefono of arTelefonos) {
            
            if(telefono.telefono.length === 18){
                let urlPerfil = await client.getProfilePicUrl(telefono.telefono);
                conexion.query(guardarSql, [urlPerfil, telefono.telefono], (err, result) => {
                    if(err) console.log("error al actualizar");
                    else  console.log("imagen actualizada", telefono.telefono);
                    let sqlMensaje = "UPDATE mensajes SET urlPerfil = '"+urlPerfil+"' WHERE telefono = '"+telefono.telefono+"'";
                    conexion.query(sqlMensaje, function(err, result){
                    });
                });
            }else{
                console.log("no se reconoce como telefono valido: ", telefono)
            }
            
        }
    });
    
}