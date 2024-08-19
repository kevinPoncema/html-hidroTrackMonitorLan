const userModel = require("../models/userModel");

class userControl {
    async logIn(req, res) {
        try {
            // Asegúrate de importar userModel correctamente
            const modelo = new userModel(); // Crear una instancia del modelo
            
            if (req.body.Registrar == "regis") {
                this.registarUsuario(req,res)
                return
            }

            const username = req.body.username;
            const pass = req.body.password; 
            /*
            if (username.length < 5 || pass.length < 5) {
                return res.status(404).render("login", { message: "Error: el mínimo es de 5 letras", colorP: "error-message" });
            }*/

            const data = await modelo.userExist([username, pass]);
            if (data.rows.length == 1) {
                req.session.username = username;
                req.session.userId = data.rows[0].id_usuario;
                return res.redirect("/mainPages");
            } else {
                const template = req.device.type === 'phone' ? 'login' : 'LoginPrincipal';
                return res.status(404).render(template, { message: "Error: Datos incorrectos", colorP: "error-message" });
            }
        } catch (error) {
            console.log(error); // Imprime el error para diagnosticar el problema
            return res.status(500).render("login", { message: "Error interno del servidor: " + error, colorP: "error-message" });
        }
    }

    async registarUsuario(req, res) {
        try {
            const modelo = new userModel(); // Asegúrate de tener una instancia del modelo

            const username = req.body.username;
            const pass = req.body.password; 
            if (username.length < 5 || pass.length < 5) {
                return res.status(404).render("login", { message: "Error: el mínimo es de 5 letras", colorP: "error-message" });
            }
            
            const data = await modelo.userExist([username, pass]);
            if (data.rows.length > 0 || data.rows === undefined) {
                return res.status(404).render("login", { message: "Usuario ya Existente", colorP: "error-message" });
            }

            await modelo.createUser([username, pass]);
            return res.render("login", { message: "Usuario Registrado Con Éxito", colorP: "success-message" });
        } catch (error) {
            console.log(error); // Imprime el error para diagnosticar el problema
            return res.status(500).render("login", { message: "Error interno del servidor: " + error, colorP: "error-message" });
        }
    }
}

module.exports = userControl;