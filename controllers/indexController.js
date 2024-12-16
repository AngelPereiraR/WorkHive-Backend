import express from 'express'

// Obtenemos el sistema de enrutado de express para configurarlo
const indexController = express.Router()

// Configuramos las ruta base con .route() y enganchamos en el verbo get la lógica que se ejecutará
indexController.route('/')
  .get((req, res) => {
    const apiVersion = { version: process.env.API_VERSION || '1.0.0', message: "¡¡Hola Mundo!!" }
    res.json(apiVersion)
  })

// Exportamos las rutas de la página principal de mi servicio ya configuradas para engancharlas en el punto de entrada (index.js)
export { indexController }
