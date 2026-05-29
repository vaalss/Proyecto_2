function App() {
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

        <div className="mb-4">
          <label className="block text-white text-sm mb-1" htmlFor="usuario">
            Usuario
          </label>
          <input
            id="usuario"
            type="text"
            placeholder="Ingresa tu usuario"
            className="w-full px-3 py-2 rounded text-white placeholder-gray-400 outline-none border border-transparent focus:border-yellow-400"
            style={{ backgroundColor: '#013565' }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm mb-1" htmlFor="contrasena">
            Contraseña
          </label>
          <input
            id="contrasena"
            type="password"
            placeholder="Ingresa tu contraseña"
            className="w-full px-3 py-2 rounded text-white placeholder-gray-400 outline-none border border-transparent focus:border-yellow-400"
            style={{ backgroundColor: '#013565' }}
          />
        </div>

        <button
          type="button"
          className="w-full py-2 rounded font-semibold text-black"
          style={{ backgroundColor: '#ffc300' }}
        >
          Ingresar
        </button>
      </div>
    </div>
  )
}

export default App
