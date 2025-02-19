import React, { useState } from "react";
import logo from "../../../../logo/LogoInicio.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const NuevoProfesor = () => {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nivel, setNivel] = useState('');
  const [rol, setRol] = useState('profesor');
  const [cv, setCV] = useState(null);
  const [cvName, setCVName] = useState('');
  const [mensajeCreado, setmensajeCreado] = useState("");

  const navigate = useNavigate();

  const niveles = {
    A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6,
  };

  const cancelar = () => {
    navigate("/administrador/listaProfesores", { replace: true })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (file.type !== 'application/pdf') {
        alert("Por favor, sube un archivo PDF");
        return;
      }
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 5MB permitido.");
        return;
      }
      setCV(file);
      setCVName(file.name);
    }
  };

  const handleRegistrar = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !email || !clave || !nivel || !cv) {
      alert("Todos los campos son obligatorios, incluyendo el CV");
      return;
    }

    try {
      const nivelId = niveles[nivel];
      const formData = new FormData();

      formData.append('nombrecompleto', `${nombre.trim()} ${apellido.trim()}`);
      formData.append('correo', email.trim());
      formData.append('contraseñaHash', clave.trim());
      formData.append('idnivel', nivelId);
      formData.append('idrol', 1);
      formData.append('cvRuta', cvRuta);

      const response = await axios.post(
        "http://localhost:5228/API/AdministradorProfesor/CrearProfesor",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.status) {
        window.alert("Profesor creado con éxito.");
        navigate(-1);
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
        {/* Header */}
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
        
        {/* Form */}
        <form onSubmit={handleRegistrar} className="p-10 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                type="text" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
                placeholder="Ingrese su nombre" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input 
                value={apellido} 
                onChange={(e) => setApellido(e.target.value)} 
                type="text" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
                placeholder="Ingrese su apellido" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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
              value={clave} 
              onChange={(e) => setClave(e.target.value)} 
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
              value={nivel} 
              onChange={(e) => setNivel(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Curriculum Vitae (PDF)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload"
              />
              <label
                htmlFor="cv-upload"
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg cursor-pointer
                         hover:bg-gray-200 transition-all duration-300 flex-grow
                         border border-gray-300"
              >
                {cvName || "Seleccionar archivo PDF"}
              </label>
              {cv && (
                <button
                  type="button"
                  onClick={() => {
                    setCV(null);
                    setCVName('');
                  }}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Máximo 5MB. Solo archivos PDF.
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <button 
              type="submit" 
              className="w-full py-3 bg-[#00A89F] text-white rounded-lg 
                         hover:bg-opacity-90 transition-all duration-300 
                         transform hover:scale-[1.01] shadow-md hover:shadow-lg"
            >
              Crear Profesor
            </button>
            <button 
              type="button" 
              onClick={cancelar}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg 
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