import { useState } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  async function handleLogin() {
    setError('')
    try {
      const response = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (response.ok) {
        setLoggedIn(true)
      } else {
        setError('El correo no está registrado')
      }
    } catch {
      setError('No se pudo conectar con el servidor')
    }
  }

  if (loggedIn) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: '#000813' }}
      >
        <div
          className="w-full max-w-sm p-8 rounded-lg text-center"
          style={{ backgroundColor: '#001d3d' }}
        >
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#ffd60a' }}>
            Booky Tuky
          </h1>
          <p className="text-white text-base mb-6">
            Sesión iniciada con: {email}
          </p>
          <button
            type="button"
            className="px-6 py-2 rounded font-semibold text-black"
            style={{ backgroundColor: '#ffc300' }}
            onClick={() => {
              setLoggedIn(false)
              setEmail('')
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: '#000813' }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-lg"
        style={{ backgroundColor: '#001d3d' }}
      >
        <h1
          className="text-2xl font-bold text-center mb-2"
          style={{ color: '#ffd60a' }}
        >
          Booky Tuky
        </h1>
        <h2 className="text-lg text-center text-white mb-6">
          Inicio de sesión
        </h2>

        <div className="mb-6">
          <label className="block text-white text-sm mb-1" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded text-white placeholder-gray-400 outline-none border border-transparent focus:border-yellow-400"
            style={{ backgroundColor: '#013565' }}
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <button
          type="button"
          className="w-full py-2 rounded font-semibold text-black"
          style={{ backgroundColor: '#ffc300' }}
          onClick={handleLogin}
        >
          Ingresar
        </button>
      </div>
    </div>
  )
}

export default App
