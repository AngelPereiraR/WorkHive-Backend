import express from 'express';

const indexController = express.Router();

/**
 * @fileoverview Controlador principal de la aplicación.
 * Contiene las rutas para la raíz (`/`), el `sitemap.xml` y el `robots.txt`.
 */

/**
 * Ruta principal (`/`).
 * Devuelve información sobre la versión de la API.
 *
 * @route GET /
 * @group General
 * @returns {Object} 200 - JSON con la versión de la API y un mensaje de bienvenida.
 */
indexController.get('/', (req, res) => {
  const apiVersion = { version: process.env.API_VERSION || '1.0.0', message: "¡¡Hola Mundo!!" };
  res.json(apiVersion);
});

/**
 * Obtiene todas las rutas registradas en la aplicación Express.
 *
 * @param {Object} app - La instancia de Express.
 * @returns {string[]} - Lista de rutas disponibles en la aplicación.
 */
function getRoutes(app) {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Ruta directa
      routes.push(middleware.route.path);
    } else if (middleware.name === 'router') {
      // Módulo de rutas con varias rutas internas
      middleware.handle.stack.forEach((subMiddleware) => {
        if (subMiddleware.route) {
          routes.push(subMiddleware.route.path);
        }
      });
    }
  });
  return routes;
}

/**
 * Genera y devuelve un `sitemap.xml` con las rutas de la aplicación.
 *
 * @route GET /sitemap.xml
 * @group SEO
 * @returns {string} 200 - XML con las URLs indexables de la aplicación.
 */
indexController.get('/sitemap.xml', (req, res) => {
  const app = req.app;
  const routes = getRoutes(app);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  routes.forEach((route) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${route}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

/**
 * Genera y devuelve el archivo `robots.txt` para gestionar el acceso de los motores de búsqueda.
 *
 * @route GET /robots.txt
 * @group SEO
 * @returns {string} 200 - Archivo `robots.txt` en texto plano.
 */
indexController.get('/robots.txt', (req, res) => {
  const robotsTxt = `
    User-agent: *
    Disallow: /admin
    Allow: /
    Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml
  `.trim();

  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

export { indexController };
