import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Configuración de Firebase para la aplicación.
 * Contiene las claves y valores necesarios para inicializar Firebase.
 * @type {Object}
 * @property {string} apiKey - Clave API para autenticar solicitudes a Firebase.
 * @property {string} authDomain - Dominio de autenticación para Firebase Authentication.
 * @property {string} projectId - ID del proyecto en Firebase.
 * @property {string} storageBucket - URL del bucket de almacenamiento en Firebase Storage.
 * @property {string} messagingSenderId - ID del remitente de mensajes de Firebase Cloud Messaging.
 * @property {string} appId - Identificador único de la aplicación en Firebase.
 */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

/**
 * Inicializa la aplicación de Firebase con la configuración proporcionada.
 * 
 * @constant {Object} app
 * @see https://firebase.google.com/docs/web/setup
 */
export const app = initializeApp(firebaseConfig);

/**
 * Instancia de Firebase Authentication para manejar funciones de autenticación como:
 * - Registro de usuarios.
 * - Inicio de sesión.
 * - Actualización de credenciales.
 * 
 * @constant {Object} auth
 * @see https://firebase.google.com/docs/auth
 */
export const auth = getAuth(app);
