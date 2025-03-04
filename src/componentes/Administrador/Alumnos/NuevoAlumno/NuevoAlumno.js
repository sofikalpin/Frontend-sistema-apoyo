import React, { useState } from "react";
import logo from "../../../../logo/LogoInicio.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const NuevoAlumno = () => {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nivel, setNivel] = useState('');
  const [mensajeCreado, setMensajeCreado] = useState("");

  const navigate = useNavigate();

  const niveles = {
    A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6,
  };

  const cancelar = () => {
    navigate("/administrador/listaAlumnos", { replace: true })
  }

  const handleRegistrar = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !email || !clave || !nivel) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const nivelId = niveles[nivel];

      const datosAlumno = {
        nombrecompleto: `${nombre.trim()} ${apellido.trim()}`,
        correo: email.trim(),
        contraseñaHash: clave.trim(),
        idnivel: nivelId,
        idrol: 2,
      };

      const response = await axios.post(
        "https://backend-sistema-apoyo-production.up.railway.app/API/AdministradorAlumno/CrearAlumno",
        datosAlumno
      );

      if (response.data.status) {
        setMensajeCreado("Alumno creado con éxito.");
        setTimeout(() => setMensajeCreado(""), 2000);
        
        setNombre("");
        setApellido("");
        setEmail("");
        setClave("");
        setNivel("");
      } else {
        alert(response.data.msg || "No se pudo crear el alumno.");
      }
    } catch (error) {
      console.error("Error al registrar alumno:", error);
      alert("Ocurrió un error al registrar el alumno. Por favor, intenta nuevamente.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4 font-sans">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-[#00A89F] p-4 sm:p-6 md:p-8 text-center relative flex flex-col items-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-28 sm:w-32 md:w-40 h-auto object-contain mb-2 sm:mb-4" 
          />
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide">
            Registro de Alumno
          </h3>
        </div>

        {mensajeCreado && (
          <div className="bg-[#00A89F] text-white text-center p-3 sm:p-4 animate-pulse">
            {mensajeCreado}
          </div>
        )}

        <form onSubmit={handleRegistrar} className="p-4 sm:p-6 md:p-10 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Nombre
              </label>
              <input 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                type="text" 
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
                placeholder="Ingrese su nombre" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Apellido
              </label>
              <input 
                value={apellido} 
                onChange={(e) => setApellido(e.target.value)} 
                type="text" 
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
                placeholder="Ingrese su apellido" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Correo Electrónico
            </label>
            <input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
              placeholder="correo@ejemplo.com" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Contraseña
            </label>
            <input 
              value={clave} 
              onChange={(e) => setClave(e.target.value)} 
              type="password" 
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
              placeholder="Contraseña segura" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Nivel de Alumno
            </label>
            <select 
              value={nivel} 
              onChange={(e) => setNivel(e.target.value)} 
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
            >
              <option value="" disabled>Seleccione un nivel</option>
              <option value="A1">A1: Principiante</option>
              <option value="A2">A2: Básico</option>
              <option value="B1">B1: Pre-intermedio</option>
              <option value="B2">B2: Intermedio</option>
              <option value="C1">C1: Intermedio-alto</option>
              <option value="C2">C2: Avanzado</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4 pt-4">
            <button 
              type="submit" 
              className="w-full py-2 sm:py-3 bg-[#00A89F] text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-[1.01] shadow-md hover:shadow-lg"
            >
              Crear Alumno
            </button>
            <button 
              type="button" 
              onClick={cancelar}
              className="w-full py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-[1.01] shadow-md hover:shadow-lg"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoAlumno;