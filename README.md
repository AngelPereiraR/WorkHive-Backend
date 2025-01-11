# WorkHive Backend

## Descripción

WorkHive Backend es una API RESTful desarrollada con Node.js y Express, diseñada para gestionar proyectos colaborativos. La aplicación permite la creación, actualización y eliminación de usuarios, tableros y tareas, así como la autenticación y autorización de usuarios mediante JWT y Firebase Authentication.

---

## Estructura del Proyecto

---

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   - Copia el archivo `.env.template` a `.env` y completa los valores necesarios.

---

## Uso

### Desarrollo

Para iniciar el servidor en modo desarrollo, utiliza el siguiente comando:

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`.

### Producción

Para iniciar el servidor en modo producción, asegúrate de tener configuradas las variables de entorno adecuadamente y ejecuta:

```bash
npm start
```

---

## Endpoints

### Usuarios

- **POST /usuarios:** Crear un nuevo usuario.
- **GET /usuarios:** Listar todos los usuarios (requiere rol de administrador).
- **POST /usuarios/logins:** Iniciar sesión de usuario.
- **GET /usuarios/:id:** Obtener un usuario por su ID.
- **PUT /usuarios/:id:** Actualizar un usuario por su ID.
- **DELETE /usuarios/:id:** Eliminar un usuario por su ID (requiere rol de administrador).

### Tableros

- **POST /tableros:** Crear un nuevo tablero.
- **GET /tableros:** Listar todos los tableros (requiere rol de administrador).
- **GET /tableros/:id:** Obtener un tablero por su ID.
- **PUT /tableros/:id:** Actualizar un tablero por su ID.
- **DELETE /tableros/:id:** Eliminar un tablero por su ID.
- **POST /tableros/:id/colaboradores:** Añadir un colaborador a un tablero.
- **DELETE /tableros/:id/colaboradores:** Eliminar un colaborador de un tablero.
- **GET /tableros/colaborador/:userId:** Obtener tableros por colaborador.
- **GET /tableros/administrador/:userId:** Obtener tableros por administrador.

### Tareas

- **POST /tareas:** Crear una nueva tarea.
- **GET /tareas:** Listar todas las tareas (requiere rol de administrador).
- **GET /tareas/:id:** Obtener una tarea por su ID.
- **PUT /tareas/:id:** Actualizar una tarea por su ID.
- **DELETE /tareas/:id:** Eliminar una tarea por su ID.
- **GET /tareas/prioridad:** Listar tareas por prioridad.
- **GET /tareas/estado:** Listar tareas por estado.
- **GET /tareas/asignado:** Listar tareas por usuario asignado.
- **GET /tareas/fechaLimite:** Listar tareas por fecha límite.

---

## Middleware

### Seguridad

- **sessionChecker:** Middleware para verificar la sesión del usuario y su rol.

### Validaciones

- **createUsuarioValidations:** Validación para la creación de usuarios.
- **updateUsuarioValidations:** Validación para la actualización de usuarios.
- **loginUsuarioValidations:** Validación para el inicio de sesión de usuarios.
- **validateObjectIdFormat:** Validación para el formato de ObjectId de Mongoose.

### Errores

- **customErrorHandler:** Middleware para manejar errores personalizados y globales.
- **pathNotFoundHandler:** Middleware para manejar rutas no encontradas.
