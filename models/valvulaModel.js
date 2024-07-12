const ConexionClass = require("./conexion");
class valculaModel {
  async cambiarEstado(valvulaId) {
    try {
      const conexion = new ConexionClass();
      await conexion.conectar();
      
      const query = `
        UPDATE tbl_sensores
        SET estado_sen = CASE
            WHEN estado_sen = 1 THEN 0
            WHEN estado_sen = 0 THEN 1
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

}

  

module.exports = valculaModel;