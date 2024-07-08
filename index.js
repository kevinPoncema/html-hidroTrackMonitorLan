require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path'); // Módulo path para manejar rutas de archivos

// Crea la app de Express
const app = express();

// Configurar body-parser para parsear datos de formularios HTML
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de express-session
app.use(session({
    secret: 'secreto', // Se utiliza para firmar la cookie de sesión
    resave: false, // Evita que se guarde la sesión si no ha habido cambios
    saveUninitialized: false // Evita guardar sesiones vacías
}));

// Middleware para analizar solicitudes con contenido JSON
app.use(express.json());

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');

// Especificar la carpeta donde se encuentran las vistas EJS
app.set('views', path.join(__dirname, 'views'));

// Ruta para servir el archivo logIn.html
app.get("/", (req, res) => {
    res.render("login", { message: "", colorP: "success-message" });
});

// Ruta para el inicio de sesión
const userControl = require("./controllers/userControler");
const userController = new userControl(); // Crear una instancia del controlador

app.post("/logIn", (req, res) => { userController.logIn(req, res) }); // Endpoint para la función de inicio de sesión

const mainControl = require("./controllers/mainControlers");
const mainController = new mainControl(); // Crear una instancia del controlador
//get mainPage
app.get("/mainPages", mainController.getMain)



app.post('/updateList', (req, res) => {listController.updateList(req,res)});
  
  // Iniciar el servidor
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log("Servidor en ejecución en el puerto " + port);
    console.log("http://localhost:" + port + "/");
});
