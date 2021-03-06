// requerimos dependencias report Alex


const express = require("express");
const cors = require("cors");
const cloudinary = require('cloudinary').v2

// Requerimos las rutas

const ChampionsRoutes = require('./src/api/champions/champions.routes')
const ClassesRoutes = require('./src/api/classes/classes.routes')
const SubclassesRoutes = require('./src/api/subclasses/subclasses.routes')
const UsersRoutes = require('./src/api/user/user.routes')
const documentation = require('./src/utils/documentation/documentation.json')


// Requerimos el controlador de errores
const { setError } = require('./src/utils/error/error')
// Nos conectamos a la Db
const { connectDb } = require("./src/utils/database/db");
// Asignamos el puerto del .env y si no lo redirigimos al puerto 8080
const PORT = process.env.PORT || 8080;

// Definimos la constante app para la funcion express
const app = express();
// ejecutamos la funcion de conexion a la db
connectDb();
// Damos los parametros a Cloudinary con los datos de .env
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

// comunicamos al header los métodos vamos a utilizar
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}) 
//PREGUNTAR 2MORROW 
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4200'],
  credentials: true
}))
// limitamos el tamaño de los archivos de subida para evitar que pete el servidor
app.use(express.json({
  limit: '5mb'
}))
app.use(express.urlencoded({ limit: '5mb', extended: true }))


app.use('/api/champions', ChampionsRoutes)
app.use('/api/classes', ClassesRoutes)
app.use('/api/subclasses', SubclassesRoutes)
app.use('api/users', UsersRoutes);
app.use('/', (req, res, next) => {
  return res.json(documentation)
})


app.use('*', (req, res, next) => {
    return next(setError(404, 'Route not found'))
})

app.use((error, req, res, next) => {
  return res.status(error.status || 500).json(error.message || 'Unexpected error')
})

app.disable('x-powered-by')

// habilitamos la escucha al puerto definido en .env
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
