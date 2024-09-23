var IotApi = require('@arduino/arduino-iot-client');
var rp = require('request-promise');
var moment = require('moment-timezone');  // Importar moment-timezone
require('dotenv').config();

console.log("client_id", process.env.client_id);
console.log("secret_key", process.env.client_secret);
let intervalo = 60000;  // Un minuto

// Función para obtener el token de autenticación
async function getToken() {
    var options = {
        method: 'POST',
        url: 'https://api2.arduino.cc/iot/v1/clients/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        json: true,
        form: {
            grant_type: 'client_credentials',
            client_id: process.env.client_id,
            client_secret: process.env.client_secret,
            audience: 'https://api2.arduino.cc/iot'
        }
    };

    try {
        const response = await rp(options);
        return response['access_token'];
    }
    catch (error) {
        console.error("Error al obtener el token de acceso: " + error);
    }
}

// Función para obtener el valor actual de una variable
async function obtenerValorActual(idSenCloud) {
    console.log("Obteniendo valor actual de la variable...");
    var client = IotApi.ApiClient.instance;
    var oauth2 = client.authentications['oauth2'];
    oauth2.accessToken = await getToken();

    var api = new IotApi.PropertiesV2Api(client);
    var thingId = process.env.thingId;
    var propertyId = idSenCloud;

    try {
        const currentValue = await api.propertiesV2Show(thingId, propertyId);
        return currentValue.last_value;  // Extraer el valor de la propiedad
    } catch (error) {
        console.error("Error al obtener el valor actual de la variable:", error);
    }
}

// Función para realizar las peticiones
async function hacerPeticiones() {
    console.log("Procesando meta datos");

    // IDs de sensores en Arduino Cloud y sus correspondientes en la API local
    const idsSensoresCloud = ["b4df948a-cd8b-4142-991b-cb25fc7c9a93", "b4df948a-cd8b-4142-991b-cb25fc7c9a93"];
    const idSensores = [1, 2];

    // Iterar sobre ambos arrays simultáneamente
    for (let i = 0; i < idsSensoresCloud.length; i++) {
        const idSenCloud = idsSensoresCloud[i];  // ID del sensor en Arduino Cloud
        const idSen = idSensores[i];  // ID del sensor en la API local

        try {
            // Obtener el valor actual del sensor en Arduino Cloud
            const valorVariable = await obtenerValorActual(idSenCloud);

            // Si obtuviste el valor correctamente, realizar la petición
            if (valorVariable !== undefined && valorVariable !== null) {
                console.log(`Valor de la variable para idSenCloud ${idSenCloud}: ${valorVariable}`);

                // Construir la URL con los parámetros
                const url = `http://localhost:3001/insert/${idSen}/${valorVariable}`;

                // Hacer la petición con fetch
                await fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Error en la petición: ${response.statusText}`);
                        }
                        console.log(`Petición exitosa para idSen ${idSen} con valor ${valorVariable}`);
                    })
                    .catch(error => {
                        console.error(`Error al hacer la petición para idSen ${idSen}:`, error);
                    });
            } else {
                console.error(`No se pudo obtener el valor para el sensor ${idSenCloud}`);
            }
        } catch (error) {
            console.error(`Error al procesar el sensor ${idSenCloud}:`, error);
        }
    }
}

// Llamar a la función inicialmente
hacerPeticiones();

// Establecer el intervalo para llamar a la función periódicamente
setInterval(hacerPeticiones, intervalo);
