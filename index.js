import express from "express";
import helmet from "helmet";
import bearerToken from "express-bearer-token";
import cors from 'cors';
import { indexController } from "./controllers/indexController.js";

const app = express()
const port = process.env.PORT || 8080

// Securizamos express con la dependencia helmet
app.use(helmet())
// Habilitamos las llamadas desde cualquier dominio externo
app.use(cors())
// Obtenemos el token recibido en la cabecera Authorizacion y lo ponemos en req.token
app.use(bearerToken())
// Parsear el cuerpo de las peticiones a un objeto js y metiéndolo en req.body
app.use(express.json())

console.info(`Entorno de ejecución ${process.env.NODE_ENV}`)

app.use(indexController)

// Arrancamos el servidor web
app.listen(port, () => {
  console.info(`Servidor funcionando en http://localhost:${port}`)
})