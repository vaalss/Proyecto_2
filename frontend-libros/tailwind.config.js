/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tu nueva paleta "Cozy / Librería"
        background: '#ffe8d6',       // Fondo principal (crema claro)
        foreground: '#6b705c',       // Texto principal (verde oliva oscuro, para leer bien)
        
        card: '#ddbea9',             // Fondo secundario (Navbar, modales)
        'card-foreground': '#6b705c',// Texto sobre el fondo secundario
        
        primary: '#cb997e',          // Tu color de acento (Terracota para botones)
        'primary-foreground': '#ffe8d6', // Texto blanco/crema sobre los botones terracota
        
        secondary: '#b7b7a4',        // Color para hovers y tarjetas sin portada
        'secondary-foreground': '#6b705c',
        
        muted: '#ddbea9',
        'muted-foreground': '#a5a58d', // Color para textos secundarios (menos importantes)
        
        border: '#a5a58d',           // Color para las líneas y bordes
      }
    },
  },
  plugins: [],
}