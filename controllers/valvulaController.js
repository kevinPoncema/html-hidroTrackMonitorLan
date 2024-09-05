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

    static async insertData(sensorId, value) {
        const valvulaDb = new valvulaModel();
        try {
          console.log(sensorId,value)
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

          //procesa la grafica de predicion de conusmo mensual
          const graficaMesualPredic =await valvulaDb.graficaMensualPorSen(idSensor)
          // Formatear la gráfica de predicción mensual
          const diasEnMes = 30;
          const datosCompletos = [];
          // Inicializar un array con 0 para todos los días del mes
          for (let i = 1; i <= diasEnMes; i++) {
              datosCompletos.push({
                  dia_del_mes: i,
                  promedio_consumo_diario: '0.00'
              });
          }

          graficaMesualPredic.forEach(dato => {
              const index = dato.dia_del_mes - 1;
              if (index >= 0 && index < datosCompletos.length) {
           // Convertir el promedio_consumo_diario a número
              let consumoDiario = parseFloat(dato.promedio_consumo_diario);
        
        // Generar un porcentaje aleatorio entre -3% y 3%
              const porcentajeAleatorio = (Math.random() * 6 - 3) / 100;
        
        // Ajustar el valor con el porcentaje aleatorio
              consumoDiario += consumoDiario * porcentajeAleatorio;
        
        // Redondear a dos decimales y actualizar el valor
              datosCompletos[index].promedio_consumo_diario = consumoDiario.toFixed(2);
              } else {
                  console.warn(`Índice fuera de rango: ${index}`);
              }
          });


          // Separar los datos en dos arrays
          const diasDelMes = datosCompletos.map(dato => dato.dia_del_mes.toString());
          const promediosDiarios = datosCompletos.map(dato => parseFloat(dato.promedio_consumo_diario));

          //obtiene los datos para la grafica de consumoMensual
          const graficaMesual =await valvulaDb.graficaMensualNormal(idSensor)
          // Formatear la gráfica  mensual
          const datosCompletosConsumo = [];
          // Inicializar un array con 0 para todos los días del mes
          for (let i = 1; i <= diasEnMes; i++) {
            datosCompletosConsumo.push({
                  dia_del_mes: i,
                  promedio_consumo_diario: '0.00'
              });
          }

          graficaMesual.forEach(dato => {
              const index = dato.dia_del_mes - 1;
              if (index >= 0 && index < datosCompletos.length) {
                datosCompletosConsumo[index].consumo_diario = dato.consumo_diario;
              } else {
                  console.warn(`Índice fuera de rango: ${index}`);
              }
          });


          // Separar los datos en dos arrays
        //   const diasDelMes = datosCompletos.map(dato => dato.dia_del_mes.toString());
          const ConsumoDiarios = datosCompletosConsumo.map(dato => parseFloat(dato.consumo_diario));


        let respuesta = {
          labelsData: labelsSemanal,
          valuesData: valuesSemanal,
          labelsDataLinea: labelsHora,
          valuesDataLinea: valuesHora,
          sensorData:senData,
          diasDelMes:diasDelMes,
          promediosDiarios:promediosDiarios,
          ConsumoDiarios:ConsumoDiarios
      };
        //console.log("json",respuesta)
          return res.json(respuesta);
        } catch (error) {
          console.error("Error al obtener y procesar los datos:", error);
          return res.status(500).send("Error interno del servidor al obtener los datos.");
        }
      }
      
      
}

module.exports = ValvulaController;


