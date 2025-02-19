import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";
import { useUser } from "../../Context/UserContext";
import logo from "../../logo/LogoInicio.png";

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
};

const Header = () => {
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // Determinar el rol y verificar autorización para profesores
  const getRoleName = () => {
    if (!user) return null;
    
    switch (user.idrol) {
      case 1: // Profesor
        return user.autProf ? "profesor" : null;
      case 2:
        return "alumno";
      case 3:
        return "administrador";
      default:
        return null;
    }
  };

  const userRole = getRoleName();
  const userName = user?.nombrecompleto || "Invitado";
  const userInitial = userName.charAt(0).toUpperCase();

  // Handlers
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const goToProfile = () => navigate("/perfil");
  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };
  const closeLogoutModal = () => setIsLogoutModalOpen(false);
  const goToChat = () => navigate("/chat");
  const goToHome = () => {
    if (!user) return navigate("/iniciarsesion");
    
    switch (user.idrol) {
      case 1:
        navigate(user.autProf ? "/profesor" : "/profesor-noAutorizado");
        break;
      case 2:
        navigate("/alumno");
        break;
      case 3:
        navigate("/administrador");
        break;
      default:
        navigate("/iniciarsesion");
    }
  };

  // Redireccionar si no hay usuario
  if (!user) {
    navigate('/iniciarsesion');
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Logo Section */}
      <div className="bg-white py-2 flex justify-end items-center px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <img
            src={logo}
            alt="EDU-MATCH"
            className="h-11 cursor-pointer"
            onClick={goToHome}
          />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between p-6" style={{ backgroundColor: '#00A89F' }}>
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center justify-between h-14">
            {/* Role-specific Navigation */}
            <nav className="flex items-center space-x-8">
              {userRole && navigationLinks[userRole]?.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-white font-bold hover:text-yellow-400 active:text-yellow-400 text-xl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {/* Mostrar el enlace del foro solo si el usuario está autorizado */}
              {(userRole && user.idrol !== 1 || (user.idrol === 1 && user.autProf)) && (
                <Link
                  to="/listaForos"
                  className="text-white font-bold hover:text-yellow-400 active:text-yellow-400 text-xl transition-colors"
                >
                  Foro
                </Link>
              )}
            </nav>

            {/* User Profile Section */}
            <div className="flex items-center space-x-3 relative">
              {/* Mostrar el chat solo si el usuario está autorizado */}
              {(userRole && user.idrol !== 1 || (user.idrol === 1 && user.autProf)) && (
                <button onClick={goToChat} className="text-white text-2xl">
                  <AiOutlineMessage />
                </button>
              )}
              <span
                className="text-white font-bold text-xl cursor-pointer"
                onClick={toggleMenu}
              >
                {userName}
              </span>
              <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white font-medium text-xl">
                {userInitial}
              </div>

              {/* Profile Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-48 p-4 mt-2 z-50">
                  <ul className="space-y-3">
                    <li className="text-gray-800 hover:text-blue-500 cursor-pointer" onClick={goToProfile}>
                      Ver Perfil
                    </li>
                    <li className="text-gray-800 hover:text-blue-500 cursor-pointer" onClick={handleLogoutClick}>
                      Cerrar Sesión
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">¿Estás seguro de que quieres cerrar sesión?</h3>
            <div className="flex justify-between">
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Aceptar
              </button>
              <button onClick={closeLogoutModal} className="bg-gray-300 text-black px-4 py-2 rounded-md">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;