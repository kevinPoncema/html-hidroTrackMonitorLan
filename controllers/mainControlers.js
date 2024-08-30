const { json } = require("body-parser");
const MainModel = require("../models/mainModel");

class mainControl {
    async getMain(req, res) {
        const userName = req.session.username;
        const mainModel = new MainModel();
        try {
            const sensors = await mainModel.getSensorsByUserName(userName);
            const grafica = await mainModel.graficaSemanalCompleta(userName);
            const graficaMesualPredic = await mainModel.graficaPromedioMensual(userName)
            const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let values = [];
    
            // Iterar sobre los días de la semana y buscar los valores correspondientes en grafica.rows
            for (const dia of labels) {
                let encontrado = false;
                for (const item of grafica.rows[0]) {
                    if (item.dia_semana === dia) {
                        values.push(parseFloat(item.consumo_diario));
                        encontrado = true;
                        break;
                    }
                }
                if (!encontrado) {
                    values.push(0); // Si no se encuentra el día, se agrega 0
                }
            }

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
                    datosCompletos[index].promedio_consumo_diario = dato.promedio_consumo_diario;
                } else {
                    console.warn(`Índice fuera de rango: ${index}`);
                }
            });


            // Separar los datos en dos arrays
            const diasDelMes = datosCompletos.map(dato => dato.dia_del_mes.toString());
            const promediosDiarios = datosCompletos.map(dato => parseFloat(dato.promedio_consumo_diario));
            //console.log(diasDelMes,promediosDiarios)
            //console.log(labels,values)
            return res.render('sensors', {
                userName: userName,
                sensors: sensors.rows,
                labelsData: JSON.stringify(labels), // Convertir a JSON para pasar al frontend
                valuesData: JSON.stringify(values), // Convertir a JSON para pasar al frontend
                diasDelMes: JSON.stringify(diasDelMes),
                promediosDiarios:JSON.stringify(promediosDiarios)
            });
        } catch (error) {
            console.error('Error al obtener los sensores del usuario:', error);
            res.status(500).send('Error al obtener los sensores del usuario');
        }
    }
    


}

module.exports = mainControl;

