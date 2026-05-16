import api from './api'

/**
 * Autentica un usuario por email y nombre.
 * Endpoint esperado: POST /api/auth/login
 * Body: { email: string, nombre: string }
 * Respuesta: { id, nombre, email, librosFavoritos, librosLeidos, autoresSeguidos }
 */
export async function login(email, nombre) {
  try {
    const { data } = await api.post('/auth/login', { email, nombre })
    return data
  } catch (err) {
    if (!err.response) {
      throw new Error(
        'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución en el puerto 8080.'
      )
    }

    const status = err.response.status
    const serverMsg = err.response.data?.message

    if (status === 404) {
      throw new Error('Usuario no encontrado. Verifica tu correo y nombre.')
    }
    if (status === 401) {
      throw new Error('Credenciales inválidas.')
    }

    throw new Error(serverMsg || `Error del servidor (${status}).`)
  }
}
