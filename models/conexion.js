require('dotenv').config({ path: '../.env' }); 
const mysql = require('mysql2/promise');

class Conexion {
constructor() {
    //obtiene los datos de conexion del env
    this.dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: "",//process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
    };
    //crea la propiedad connection como ull
    this.connection = null;
    }
//se conecta a la db
async conectar() {
    try {
        this.connection = await mysql.createConnection(this.dbConfig);
        //console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
}
//se desconecta de la db
async desconectar() {
    try {
        if (this.connection) {
            await this.connection.end();
            //console.log('Conexión cerrada correctamente');
        }
    } catch (error) {
        console.error('Error al cerrar la conexión:', error);
        throw error;
    }
}
//hacce una consulta con parametros
async queryParams(sql, params = []) {
    try {
        //ejecuta la consulta con parametros
        const [rows, fields] = await this.connection.execute(sql, params);
        const affectedRows = rows.affectedRows;
        return { rows:rows,affectedRows: affectedRows,fields:fields };//devulve los resultados
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
}
//hace consultas que solo modifican filas no obtiene nigun datos
async queryModifay(sql, params = []) {
    try {
    const [result] = await this.connection.execute(sql, params);
    return result.affectedRows;
    } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
    }
}
}

module.exports = Conexion;

