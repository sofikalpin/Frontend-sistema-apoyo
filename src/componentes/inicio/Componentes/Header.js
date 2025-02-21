import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useUser } from "../../../Context/UserContext";
import logo from "../../../logo/LogoInicio.png";
import ProgramDropdown from "./ProgramDropdown";

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
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isForumRelatedPage = (pathname) => {
    console.log("Current pathname:", pathname);

    const forumPaths = [
      "/crear-consulta",
      "/crear-respuesta",
      "/listaForos",
      "/crear-foro",
      "/foro",
      "/consulta",
      "/respuesta",
    ];

    const isExactMatch = forumPaths.some((path) => pathname === path);
    const isCrearConsultaWithId = pathname.includes("/crear-consulta/");
    const containsForumPath =
      pathname.startsWith("/foro/") ||
      pathname.startsWith("/consulta/") ||
      pathname.startsWith("/nuevaConsulta") ||
      pathname.startsWith("/nuevaRespuesta");

    const shouldHide = isExactMatch || containsForumPath || isCrearConsultaWithId;
    console.log("Should hide forum button:", shouldHide);

    return shouldHide;
  };

  const hideForo = isForumRelatedPage(location.pathname);

  const getRoleName = () => {
    if (!user) return null;

    switch (user.idrol) {
      case 1:
        return user.autProf ? "profesor" : "profesor-noAutorizado";
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
    if (!user) return navigate("/");

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
        navigate("/");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col w-full">
        <header className="flex items-center justify-between p-6" style={{ backgroundColor: "#00A89F" }}>
          <nav className="flex items-center gap-6">
            <img
              src={logo || "/placeholder.svg"}
              alt="EDU-MATCH"
              className="h-11 cursor-pointer mr-4"
              onClick={() => navigate("/")}
            />
            <button
              onClick={() => navigate("/inicioprofesor")}
              className="text-white font-bold hover:text-yellow-400 active:text-yellow-400 text-xl transition-colors"
            >
              Profesores
            </button>
            <div className="relative">
              <button
                onMouseEnter={() => setIsProgramsOpen(true)}
                className="text-white font-bold hover:text-yellow-400 active:text-yellow-400 text-xl transition-colors flex items-center gap-2"
              >
                Programas
                <ChevronDown className={`w-5 h-5 transition-transform ${isProgramsOpen ? "rotate-180" : ""}`} />
              </button>
              <ProgramDropdown isOpen={isProgramsOpen} onClose={() => setIsProgramsOpen(false)} />
            </div>
            <button
              onClick={() => navigate("/informacion")}
              className="text-white font-bold hover:text-yellow-400 active:text-yellow-400 text-xl transition-colors"
            >
              Conocenos
            </button>
          </nav>

          <nav className="flex gap-6">
            <button
              onClick={() => navigate("/iniciarsesion")}
              className="text-white font-bold hover:text-yellow-400 active:text-yellow-400 text-xl transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate("/registrarse")}
              className="text-white font-bold hover:text-yellow-400 active:text-yellow-400 text-xl transition-colors"
            >
              Registrarse
            </button>
          </nav>
        </header>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between p-6" style={{ backgroundColor: "#00A89F" }}>
        <div className="w-full">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <img
                src={logo || "/placeholder.svg"}
                alt="EDU-MATCH"
                className="h-11 cursor-pointer mr-4"
                onClick={goToHome}
              />

              <nav className="flex items-center space-x-4">
                {userRole === "profesor-noAutorizado" ? (
                  <Link to="/profesor-noAutorizado" className="text-white font-bold hover:text-yellow-400 text-xl">
                    Inicio
                  </Link>
                ) : (
                  <>
                    {navigationLinks[userRole]?.map((link) => (
                      <Link key={link.path} to={link.path} className="text-white font-bold hover:text-yellow-400 text-xl">
                        {link.label}
                      </Link>
                    ))}

                    {!hideForo && ((userRole && user.idrol !== 1) || (user.idrol === 1 && user.autProf)) && (
                      <Link to="/listaForos" className="text-white font-bold hover:text-yellow-400 text-xl">
                        Foro
                      </Link>
                    )}
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
