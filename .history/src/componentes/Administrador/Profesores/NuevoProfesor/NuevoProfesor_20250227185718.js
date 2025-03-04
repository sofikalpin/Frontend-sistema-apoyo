import React, { useState } from "react";
import logo from "../../../../logo/LogoInicio.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const NuevoProfesor = () => {
  const [formData, setFormData] = useState({
    idusuario: 0,
    nombrecompleto: "",
    correo: "",
    contraseñaHash: "",
    fecharegistro: new Date().toISOString().split('T')[0],
    idnivel: 0,
    idrol: 1,
    autProf: true,
    tokenRecuperacion: "",
    tokenExpiracion: new Date().toISOString(),
    cvRuta: "",
    fotoRuta: ""
  });

  const navigate = useNavigate();

  const niveles = {
    A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6,
  };

  const cancelar = () => {
    navigate("/administrador/listaProfesores", { replace: true })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNivelChange = (e) => {
    const nivelId = niveles[e.target.value];
    setFormData(prev => ({
      ...prev,
      idnivel: nivelId
    }));
  };

  const handleRegistrar = async (e) => {
    e.preventDefault();

    if (!formData.nombrecompleto || !formData.correo || !formData.contraseñaHash || !formData.idnivel ) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post(
        "https://backend-sistema-apoyo-production.up.railway.app/API/AdministradorProfesor/CrearProfesor",
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        window.alert("Profesor creado con éxito. Dirigir a subir cv de profesor.");
        navigate("/administrador/listaProfesores/nuevoProfesor/subircv");
      } else {
        alert(response.data.msg || "No se pudo crear el profesor.");
      }
    } catch (error) {
      console.error("Error al registrar profesor:", error);
      alert("Ocurrió un error al registrar el profesor. Por favor, intenta nuevamente.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        
        <div className="bg-[#00A89F] p-8 text-center relative flex flex-col items-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-40 h-auto object-contain mb-4" 
          />
          <h3 className="text-3xl font-bold text-white tracking-wide">
            Registro de Profesor
          </h3>
        </div>
        
        <form onSubmit={handleRegistrar} className="p-6 sm:p-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input 
              name="nombrecompleto"
              value={formData.nombrecompleto} 
              onChange={handleInputChange} 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
              placeholder="Ingrese nombre completo" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input 
              name="correo"
              value={formData.correo} 
              onChange={handleInputChange} 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
              placeholder="correo@ejemplo.com" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input 
              name="contraseñaHash"
              value={formData.contraseñaHash} 
              onChange={handleInputChange} 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
              placeholder="Contraseña segura" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de Profesor
            </label>
            <select 
              onChange={handleNivelChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
              defaultValue=""
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

          <div className="flex flex-col sm:flex-row sm:space-x-4 pt-4">
            <button 
              type="submit" 
              className="w-full sm:w-auto py-3 bg-[#00A89F] text-white rounded-lg 
                         hover:bg-opacity-90 transition-all duration-300 
                         transform hover:scale-[1.01] shadow-md hover:shadow-lg"
            >
              Crear Profesor
            </button>
            <button 
              type="button" 
              onClick={cancelar}
              className="w-full sm:w-auto py-3 bg-gray-200 text-gray-700 rounded-lg 
                         hover:bg-gray-300 transition-all duration-300 
                         transform hover:scale-[1.01] shadow-md hover:shadow-lg"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoProfesor;
