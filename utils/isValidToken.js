import jwt from 'jsonwebtoken';

/**
 * Verifica si un token es válido y no está en la lista de tokens inválidos.
 *
 * @param {string} token - El token a verificar.
 * @param {Set<string>} invalidTokens - Conjunto de tokens inválidos.
 * @returns {boolean} - `true` si el token es válido, `false` en caso contrario.
 */
const isValidToken = (token, invalidTokens) => {
  try {
    // Verifica si el token está en la lista de tokens inválidos
    if (invalidTokens.has(token)) {
      return false;
    }

    // Decodifica y verifica el token utilizando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Opcional: Validaciones adicionales si son necesarias
    return !!decoded;
  } catch (error) {
    // Si el token no es válido o está expirado, se captura la excepción
    return false;
  }
};

export default isValidToken;
