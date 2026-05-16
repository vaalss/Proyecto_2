import { useState } from 'react'
import { BookOpen, Mail, User, Loader2, AlertCircle, BookMarked } from 'lucide-react'
import { login } from '../services/authService'

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', nombre: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const usuario = await login(form.email.trim(), form.nombre.trim())
      onLogin(usuario)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
      {/* Decorative floating book icons */}
      <BookMarked className="absolute top-16 left-16 w-8 h-8 text-indigo-800/40 rotate-12 hidden lg:block" />
      <BookMarked className="absolute bottom-24 right-20 w-6 h-6 text-purple-800/40 -rotate-6 hidden lg:block" />
      <BookOpen className="absolute top-1/3 right-12 w-5 h-5 text-indigo-700/30 rotate-3 hidden lg:block" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo + título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/30">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
            Biblios
          </h1>
          <p className="text-slate-400 text-sm">
            Sistema de recomendación de libros
          </p>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl shadow-black/40">
          <h2 className="text-lg font-semibold text-white mb-6">
            Iniciar sesión
          </h2>

          {/* Mensaje de error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Campo nombre */}
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  disabled={loading}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                />
              </div>
            </div>

            {/* Campo email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  disabled={loading}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                />
              </div>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading || !form.email || !form.nombre}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 px-4 text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Algoritmos y Estructuras de Datos · UVG 2025
        </p>
      </div>
    </div>
  )
}
