
export default (area, client, con) => {
  if(area){
    var exiteUsuario = "SELECT consultas FROM areas WHERE area = '"+area+"'";
    con.query(exiteUsuario, function (err, result) {
      if (err) {
        client.sendMessage('5492664840533@c.us', 'Crasheo el insertCantConsultas\n' + err);
        return console.log("error en insertCantConsultas");
      }
      // console.log(result[0].consultas);
      if(result.length > 0 ){ 
        // console.log("consulta derivada");
        var cont = result[0].consultas+1;
        var sql="UPDATE areas SET consultas='"+cont+"' WHERE area = '"+area+"'";
        con.query(sql, function (err, result) {
          if (err) {
            client.sendMessage('5492664840533@c.us', 'Crasheo el insertCantConsultas\n' + err);
            return console.log("error en insertCantConsultas");
          }
          // console.log("1 record updated");
        });
      }
    }); 
  }
      
}