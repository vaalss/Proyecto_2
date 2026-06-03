import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
  const usuarioGuardado = localStorage.getItem("usuario")

  // Si no hay nada en el localStorage, bloquea el renderizado y te manda al inicio
  if (!usuarioGuardado) {
    return <Navigate to="/" replace />
  }

  // Si sí hay sesión, permite que el router dibuje la página que pediste
  return <Outlet />
}