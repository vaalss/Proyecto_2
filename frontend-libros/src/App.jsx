import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cuando la URL esté vacía (/), muestra el Login */}
        <Route path="/" element={<Login />} />
        
        {/* Cuando la URL sea /home, muestra el Home */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App