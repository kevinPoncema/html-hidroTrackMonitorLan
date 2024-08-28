const ConexionClass = require("./conexion");
class mainModel {
  async getSensorsByUserName(userName) {
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      
      const query = `
        SELECT s.*
        FROM tbl_usuario u
        JOIN tbl_sensores s ON u.id_usuario = s.id_usuario
        WHERE u.nombre_usuario = ?
      `;
      const params = [userName];
      
      const data = await conexion.queryParams(query, params);
      await conexion.desconectar(); // Cerrar la conexión después de usarla
      return data;
    } catch (error) {
      console.error('Error al obtener los sensores del usuario:', error);
      throw error;
    }
  }

  async graficaSemanalCompleta(userName){
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      
      const query = `call getWeekdataUser(?)`;
      const params = [userName];
      const data = await conexion.queryParams(query, params);
      await conexion.desconectar(); // Cerrar la conexión después de usarla
      return data;
    } catch (error) {
      console.error('Error al obtener la grafica:', error);
      throw error;
    }
  }
  
  async graficaPromedioMensual(userName){
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      
      const query = `CALL promedio_mensual_general(?)`;
      const params = [userName];
      const data = await conexion.queryParams(query, params);
      await conexion.desconectar(); // Cerrar la conexión después de usarla
      return data;
    } catch (error) {
      console.error('Error al obtener la grafica:', error);
      throw error;
    }
  }
  
}

module.exports = mainModel;

