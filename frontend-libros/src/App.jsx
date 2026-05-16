import { useState } from 'react'
import Login from './views/Login'
import './index.css'

function App() {
  const [usuario, setUsuario] = useState(null)

  if (!usuario) {
    return <Login onLogin={setUsuario} />
  }

  // TODO: reemplazar con el router/dashboard real
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Bienvenido, {usuario.nombre}
        </h1>
        <p className="text-slate-400 text-sm">{usuario.email}</p>
      </div>
    </div>
  )
}

export default App
