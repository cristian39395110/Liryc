export default (con) => {
    var sql = "SELECT 1 FROM templateencuesta";
    con.query(sql, function (err, result) {
        if (err) {
          return console.log("error en Despertar " + err);
        }
    });
}