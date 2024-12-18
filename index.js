import express from "express";
import helmet from "helmet";
import bearerToken from "express-bearer-token";
import cors from 'cors';
import { indexController } from "./controllers/indexController.js";

const app = express();
const port = process.env.PORT || 8080;

/**
 * Middleware para asegurar la aplicación con Helmet, que establece varias cabeceras HTTP
 * para proteger la aplicación de ataques comunes.
 */
app.use(helmet());

/**
 * Middleware para habilitar el uso de CORS (Cross-Origin Resource Sharing),
 * permitiendo que la aplicación acepte peticiones de dominios externos.
 */
app.use(cors());

/**
 * Middleware para obtener el token de autorización del encabezado "Authorization".
 * El token se coloca en `req.token` para su posterior uso.
 */
app.use(bearerToken());

/**
 * Middleware para analizar el cuerpo de las peticiones entrantes en formato JSON
 * y convertirlo en un objeto JavaScript accesible a través de `req.body`.
 */
app.use(express.json());

/**
 * Log de entorno de ejecución. Se muestra el valor de `NODE_ENV`, que puede ser
 * utilizado para diferenciar entre desarrollo, producción o pruebas.
 */
console.info(`Entorno de ejecución ${process.env.NODE_ENV}`);

/**
 * Rutas de la aplicación.
 * Se utiliza `indexController` para manejar las rutas de la raíz de la aplicación.
 */
app.use(indexController);

/**
 * Inicia el servidor web y lo pone a escuchar en el puerto especificado.
 * 
 * @param {number} port - El puerto en el que el servidor escuchará las peticiones.
 */
app.listen(port, () => {
  console.info(`Servidor funcionando en http://localhost:${port}`);
});
