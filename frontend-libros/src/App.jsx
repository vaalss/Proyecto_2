import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'

// ─── Guardia de Seguridad (Ruta Protegida) ────────────────────────────────────
// Este componente envuelve las páginas privadas. Si no hay sesión, te echa al Login.
function ProtectedRoute({ children }) {
  const usuarioLogueado = localStorage.getItem('usuario')
  
  if (!usuarioLogueado) {
    // Replace evita que el usuario pueda usar el botón de "Atrás" para regresar
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas Privadas (Protegidas) */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />

        {/* Aquí agregaremos las siguientes páginas:
          <Route path="/libro/:id" element={<ProtectedRoute><LibroDetalle /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        */}
      </Routes>
    </BrowserRouter>
  )
}

export default App