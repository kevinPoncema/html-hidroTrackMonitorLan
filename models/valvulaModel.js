const ConexionClass = require("./conexion");
class valculaModel {
  async cambiarEstado(valvulaId) {
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      
      const query = `
        UPDATE tbl_sensores
        SET estado_sen = CASE estado_sen
            WHEN 1 THEN 0
            WHEN 0 THEN 1
            ELSE estado_sen -- Manejo del caso por defecto, aunque debería ser manejado en la aplicación
        END
        WHERE id_sen = ?;
      `;
      const params = [valvulaId];
      const data = await conexion.queryParams(query, params);
      await conexion.desconectar(); // Cerrar la conexión después de usarla
      return data;
    } catch (error) {
      console.error('Error al obtener los sensores del usuario:', error);
      throw error;
    }
  }

  async insertData(sensorId,value){
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      const query = "INSERT INTO tbl_mediciones(id_sensor,valor)VALUES(?,?);"
        const params = [sensorId,value];
        const data = await conexion.queryParams(query, params);
        await conexion.desconectar(); // Cerrar la conexión después de usarla
    } catch (error) {
      throw error;
    }
  }

  async graficaSemanalCompleta(idSen){
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      
      const query = `CALL getWeekdataSen(?)`;
      const params = [idSen];
      const data = await conexion.queryParams(query, params);
      await conexion.desconectar(); // Cerrar la conexión después de usarla
      return data;
    } catch (error) {
      console.error('Error al obtener la grafica:', error);
      throw error;
    }
  }

  async graficaHora(idSen){
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      
      const query = `CALL getHorasData(?)`;
      const params = [idSen];
      const data = await conexion.queryParams(query, params);
      await conexion.desconectar(); // Cerrar la conexión después de usarla
      return data;
    } catch (error) {
      console.error('Error al obtener la grafica:', error);
      throw error;
    }
  }

  async getSensorData(idSen){
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      
      const query = `SELECT * FROM tbl_sensores WHERE id_sen = ?`;
      const params = [idSen];
      const data = await conexion.queryParams(query, params);
      await conexion.desconectar(); // Cerrar la conexión después de usarla
      return data;
    } catch (error) {
      console.error('Error al obtener la grafica:', error);
      throw error;
    }
  }

  async graficaMensualPorSen(idSen){
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      
      const query = `CALL proemdio_mensual_sen(?)`;
      const params = [idSen];
      const data = await conexion.queryParams(query, params);
      await conexion.desconectar(); // Cerrar la conexión después de usarla
      return data.rows[0];
    } catch (error) {
      console.error('Error al obtener la grafica:', error);
      throw error;
    }
  }

  async getSenStatus(){
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      
      const query = `SELECT s.id_sen,s.estado_sen FROM tbl_sensores s WHERE s.tipo_sen = 1;`;
      const data = await conexion.queryParams(query, []);
      await conexion.desconectar(); // Cerrar la conexión después de usarla
      return data;
    } catch (error) {
      console.error('Error al obtener los status', error);
      throw error;
    }
  }

  async graficaMensualNormal(idSen){
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      
      const query = `CALL getConsumoMensualSen(?)`;
      const params = [idSen];
      const data = await conexion.queryParams(query, params);
      await conexion.desconectar(); // Cerrar la conexión después de usarla
      return data.rows[0];
    } catch (error) {
      console.error('Error al obtener la grafica:', error);
      throw error;
    }
  }

}



  

module.exports = valculaModel;