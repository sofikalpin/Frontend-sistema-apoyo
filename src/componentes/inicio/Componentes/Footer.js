import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';

const socialIcons = [
  { name: 'Facebook', icon: Facebook, color: 'hover:text-blue-500', link: 'https://www.facebook.com/profile.php?id=61573209179555' },
  { name: 'Instagram', icon: Instagram, color: 'hover:text-pink-500', link: 'https://www.instagram.com/edumatch.ingles?igsh=MTFndjJidGZuc2dndQ%3D%3D&utm_source=qr' },
  { name: 'Twitter', icon: Twitter, color: 'hover:text-blue-400', link: 'https://twitter.com/EduMatch2024' },
  { name: 'Youtube', icon: Youtube, color: 'hover:text-red-500', link: 'https://www.youtube.com/@EduMatch2024' },
  { name: 'Linkedin', icon: Linkedin, color: 'hover:text-blue-700', link: 'https://www.linkedin.com/in/edumatch-ingles-aaa69a351?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app' },
];

const Footer = ({ role }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSocialClick = (link) => {
    window.open(link, '_blank');
  };

  let section1 = { title: "Información", links: [{ name: "Sobre Nosotros", path: "/informacion" }, { name: "Términos y Condiciones", path: "/informacion" }, { name: "Contacto", path: "/informacion" }] };
  let section2 = {};

  switch (role) {
    case 'alumno':
      section2 = { title: "Programa", links: [{ name: "Nivel Inicial", path: "/NivelInicial" }, { name: "Nivel Intermedio", path: "/NivelIntermedio" }, { name: "Nivel Avanzado", path: "/NivelAvanzado" }] };
      break;
    case 'profesor':
    case 'profesorNoAutorizado':
      section2 = { title: "Danos tu opinión!", links: [{ name: "Junto a ArgyReviews", path: "/resena" }] };
      break;
    case 'administrador':
      section2 = null;
      break;
    case 'foro':
      section2 = null;
      break;
    default:
      section2 = null;
  }

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">{section1.title}</h3>
            <ul className="space-y-2">
              {section1.links.map((link, index) => (
                <li key={index}>
                  <button onClick={() => handleNavigation(link.path)} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {section2 && (
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-lg mb-4">{section2.title}</h3>
              <ul className="space-y-2">
                {section2.links.map((link, index) => (
                  <li key={index}>
                    <button onClick={() => handleNavigation(link.path)} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Redes Sociales</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialIcons.map((icon, index) => {
                const IconComponent = icon.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSocialClick(icon.link)}
                    className={`text-gray-400 ${icon.color} transition-colors`}
                    aria-label={icon.name}
                  >
                    <IconComponent size={24} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-gray-800 text-center md:text-left">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EduMatch. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const role = "alumno"; // Cambia el rol dinámicamente según corresponda
  return (
    <div className="bg-gray-100">
      <Footer role={role} />
    </div>
  );
}
