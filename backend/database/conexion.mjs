import mysql from 'mysql2' // importa la libreria de mysql
export default mysql.createPool({
host: 'localhost',
user: 'root',
password: '',
database: 'wp',
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0,
connectTimeout: 10000
});