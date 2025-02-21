import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { AiOutlineMessage } from "react-icons/ai"
import { ChevronDown } from "lucide-react"
import { useUser } from "../context/userContext"
import logo from "../logo/LogoInicio.png"
import ProgramDropdown from "./inicio/Componentes/ProgramDropdown"

const navigationLinks = {
  alumno: [
    { path: "/alumno", label: "Mis Cursos" },
    { path: "/alumno/profesores", label: "Profesores" },
  ],
  profesor: [
    { path: "/profesor", label: "Inicio" },
    { path: "/profesor/cursos", label: "Cursos" },
    { path: "/profesor/alumnos", label: "Alumnos" },
  ],
  administrador: [
    { path: "/administrador", label: "Inicio" },
    { path: "/administrador/listaProfesores", label: "Profesores" },
    { path: "/administrador/listaAlumnos", label: "Alumnos" },
  ],
}

const Header = () => {
  const { user, logout } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isProgramsOpen, setIsProgramsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const goToProfile = () => navigate("/perfil")
  const goToHome = () => navigate(user ? `/${user.role}` : "/")
  const goToChat = () => navigate("/chat")
  
  return (
    <header className="w-full bg-[#00A89F] p-4 md:p-6 flex items-center justify-between">
      {/* Logo y Navegación */}
      <div className="flex items-center gap-4">
        <img src={logo} alt="EDU-MATCH" className="h-10 cursor-pointer" onClick={goToHome} />
        <nav className="hidden md:flex gap-4">
          {user && navigationLinks[user.role]?.map(link => (
            <Link key={link.path} to={link.path} className="text-white font-bold text-lg hover:text-yellow-400">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Iconos y Menú */}
      <div className="flex items-center gap-3 relative">
        {user && (
          <>
            <button onClick={goToChat} className="text-white text-2xl">
              <AiOutlineMessage />
            </button>
            <span className="text-white font-bold cursor-pointer hidden md:block" onClick={toggleMenu}>
              {user.nombrecompleto || "Invitado"}
            </span>
            <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white font-medium">
              {user.nombrecompleto?.charAt(0).toUpperCase()}
            </div>
          </>
        )}
        <button className="md:hidden text-white text-2xl" onClick={toggleMenu}>☰</button>
      </div>
      
      {/* Menú Responsive */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 w-48 md:hidden">
          {user ? (
            <>
              {navigationLinks[user.role]?.map(link => (
                <Link key={link.path} to={link.path} className="block py-2 text-gray-800 hover:text-blue-500">
                  {link.label}
                </Link>
              ))}
              <button onClick={logout} className="block w-full text-left py-2 text-red-500">Cerrar Sesión</button>
            </>
          ) : (
            <>
              <Link to="/iniciarsesion" className="block py-2 text-gray-800 hover:text-blue-500">Iniciar Sesión</Link>
              <Link to="/registrarse" className="block py-2 text-gray-800 hover:text-blue-500">Registrarse</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Header;
