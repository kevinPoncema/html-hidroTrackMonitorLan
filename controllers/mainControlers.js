const MainModel = require("../models/mainModel");

class mainControl {
    async getMain(req, res) {
        const userName = req.session.username;
        const mainModel = new MainModel();
        try {
            const sensors = await mainModel.getSensorsByUserName(userName);
            const grafica = await mainModel.graficaSemanalCompleta(userName);
            console.log("Datos dese controller",grafica)
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

            //console.log(labels,values)
            return res.render('sensors', {
                userName: userName,
                sensors: sensors.rows,
                labelsData: JSON.stringify(labels), // Convertir a JSON para pasar al frontend
                valuesData: JSON.stringify(values) // Convertir a JSON para pasar al frontend
            });
        } catch (error) {
            console.error('Error al obtener los sensores del usuario:', error);
            res.status(500).send('Error al obtener los sensores del usuario');
        }
    }
    

}

module.exports = mainControl;

