require('dotenv').config();
const express = require('express');
const device = require('express-device');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path'); // Módulo path para manejar rutas de archivos
const http = require('http'); // Importar http
const socketIo = require('socket.io'); // Importar socket.io
const schedule = require('node-schedule');
const cors = require('cors'); // Importar cors
// Crea la app de Express
const app = express();
app.use(cors({
    origin: '*', // Permite conexiones desde cualquier origen. Puedes restringir esto a dominios específicos si lo prefieres.
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));
  
  
// Crear el servidor HTTP
const server = http.createServer(app);
// Inicializar Socket.IO con el servidor
const io = socketIo(server, {
    cors: {
      origin: '*', // Permite conexiones desde cualquier origen. Puedes restringir esto a dominios específicos si lo prefieres.
      methods: ['GET', 'POST']
    }
  });

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
app.get("/",device.capture(), (req, res) => {
    if (req.device.type === 'phone'){
        res.render("login", { message: "goku", colorP: "success-message" });
    }else{
        return   res.render("LoginPrincipal", { message: "", colorP: "success-message" })
    }
});



// Ruta para el inicio de sesión
const userControl = require("./controllers/userControler");
const userController = new userControl(); // Crear una instancia del controlador

app.post("/logIn",device.capture(), (req, res) => { userController.logIn(req, res) }); // Endpoint para la función de inicio de sesión

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
const { error } = require('console');
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
      socket.on('programarAccion', (data) => {
        console.log("Recibido evento programarAccion");
        // Extraer los datos recibidos
        const { date, sensorId, opc } = data;    
        // Validar que la fecha exista
        if (!date) {
            io.emit("sendMsg", { msg: "Fecha no proporcionada", ui: "main" });
            return;
        }
        // Convertir la fecha a un objeto Date
        const scheduleDate = new Date(date);
        // Validar que la fecha sea válida
        if (isNaN(scheduleDate.getTime())) {
            io.emit("sendMsg", { msg: "Fecha inválida", ui: "main" });
            return;
        }
        // Crear el evento programado
        schedule.scheduleJob(scheduleDate, async () => {
            try {
                await valControl.cambiarEstado(sensorId, opc);
                io.emit("reloadData", sensorId);
                console.log("Acción ejecutada con éxito para el sensor:", sensorId);
            } catch (error) {
                console.error("Error al cambiar el estado del sensor:", error);
                io.emit("sendMsg", { msg: "Error al ejecutar la acción", ui: "main" });
            }
        });
        console.log("Acción programada para el sensor:", sensorId, "en la fecha:", scheduleDate +"valor "+opc);
        io.emit("sendMsg", { msg: "Acción programada con éxito", ui: "main" });
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
