const valvulaModel = require("../models/valvulaModel.js");

class ValvulaController {
    constructor(io) {
        this.io = io; // Save io instance
    }

    async cambiarEstado(val, preEstado) {
        const valvulaDb = new valvulaModel();
        try {
            await valvulaDb.cambiarEstado(val);
            if (preEstado === 1) {
                this.io.emit('arduinoCierra', val);
            } else {
                this.io.emit('arduinoAbre', val);
            }
        } catch (error) {
            console.error('Error al cambiar el estado de la válvula:', error);
        }
    }
}

module.exports = ValvulaController;


