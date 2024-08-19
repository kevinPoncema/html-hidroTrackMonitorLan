const { json } = require("body-parser");
const valvulaModel = require("../models/valvulaModel.js");
class ValvulaController {
    constructor(io) {
        this.io = io; // Save io instance
    }

    async cambiarEstado(val, preEstado) {
        const valvulaDb = new valvulaModel();
        try {
            await valvulaDb.cambiarEstado(val);
            if (preEstado == 2) {
              //console.log(preEstado,"cerrando")
                this.io.emit('arduinoAbre', val);
            } else {
                //console.log(preEstado,"abreindo")
                this.io.emit('arduinoCierra', val);
            }
        } catch (error) {
            console.error('Error al cambiar el estado de la válvula:', error);
        }
    }

    async insertData(sensorId, value) {
        const valvulaDb = new valvulaModel();
        try {
            await valvulaDb.insertData(sensorId,value);
        } catch (error) {
            console.error('Error al cambiar el insertar datos de los sensores:', error);
        }
    }
    async mostratDatos(req, res) {
        const valvulaDb = new valvulaModel();
        const idSensor = req.params.idSensor;
        
        if (!req.session.userId && req.session.userId == null) {
          return res.send("Error: Usuario no autenticado. Inicie sesión.");
        }

        try {
          // Procesa los datos de la gráfica de barra
          const grafica = await valvulaDb.graficaSemanalCompleta(idSensor);
          const labelsSemanal = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          let valuesSemanal = labelsSemanal.map(dia => {
            const item = grafica.rows[0].find(item => item.dia_semana === dia);
            return item ? parseFloat(item.consumo_diario) : 0;
          });
      
          // Procesa la gráfica de línea
          const grafica2 = await valvulaDb.graficaHora(idSensor);
          const labelsHora = grafica2.rows[0].map(item => item.hora);
          const valuesHora = grafica2.rows[0].map(item => parseFloat(item.consumo_hora));
      
          //obtiene los datos del sensor y no de las mediciones 
          const senData =await valvulaDb.getSensorData(idSensor)
        // Crear el objeto de respuesta
        let respuesta = {
          labelsData: labelsSemanal,
          valuesData: valuesSemanal,
          labelsDataLinea: labelsHora,
          valuesDataLinea: valuesHora,
          sensorData:senData
      };

        //console.log("json",res2)
          return res.json(respuesta);
        } catch (error) {
          console.error("Error al obtener y procesar los datos:", error);
          return res.status(500).send("Error interno del servidor al obtener los datos.");
        }
      }
      
      
}

module.exports = ValvulaController;


