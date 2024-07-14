require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path'); // Módulo path para manejar rutas de archivos
const http = require('http'); // Importar http
const socketIo = require('socket.io'); // Importar socket.io
const schedule = require('node-schedule');
// Crea la app de Express
const app = express();

// Crear el servidor HTTP
const server = http.createServer(app);
const io = socketIo(server); // Inicializar Socket.IO con el servidor

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

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

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

// Get mainPage
app.get("/mainPages", mainController.getMain);

// Update list
//app.post('/updateList', (req, res) => { listController.updateList(req, res) });

app.get("/test",(req,res)=>{
    return res.render("test")
})

const ValvulaController = require("./controllers/valvulaController");
const { send } = require('process');
const valControl = new ValvulaController(io); // Crear una instancia del controlador

app.get("/moreData/:idSensor",valControl.mostratDatos)

app.get("/renderMysen/:idSen",(req,res)=>{
    if (!req.session.userId && req.session.userId == null) {
        return res.send("Error: Usuario no autenticado. Inicie sesión.");
      }
    res.render("mySen",{senID:req.params.idSen})})

// Configuración de eventos de Socket.IO
io.on('connection', (socket) => {
    socket.emit("getConsumoActual");

    // prueba de conexion
    socket.on('message', (data) => {
        console.log('Mensaje recibido:', data);
        // Emitir el mensaje a todos los clientes
        io.emit('message', data);
    });

    socket.on('actualizarEstado', (sensorId,preEstado) => {
       // console.log(sensorId,preEstado)
        valControl.cambiarEstado(sensorId,preEstado)
    });


    socket.on('actualizarConsumo', (consumoActual) => {
        //document.getElementById("consumoActual").innerText = consumoActual
        console.log(consumoActual)
        io.emit("actualizarConsumo2",consumoActual)
      });

      socket.on("insertData",async (sensorId,value)=>{
        await valControl.insertData(sensorId,value)
        io.emit("reloadData",sensorId);})

      // Manejar evento 'cierreProgramado'
    socket.on('cierreProgramado', (data) => {
        const {date } = data;

        if (!date) {return;}

        const scheduleDate = new Date(date);
        if (isNaN(scheduleDate.getTime())) {
            io.emit("sendMsg",msg="fecha invalida",ui="main")
            return;
        }

        schedule.scheduleJob(scheduleDate, () => {
            
        });

        io.emit("sendMsg",msg="cierre programado con exito",ui="main")
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
const port = process.env.PORT || 3002;
server.listen(port, () => {
    console.log("Servidor en ejecución en el puerto " + port);
    console.log("http://localhost:" + port + "/");
});
