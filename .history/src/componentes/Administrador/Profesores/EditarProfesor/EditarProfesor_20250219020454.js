import React, { useEffect, useState } from "react";
import logo from "../../../../logo/LogoInicio.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const niveles = {
  A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6,
};

export const EditarProfesor = ({ onUpdate }) => {
  const location = useLocation();
  const idusuario = location.state?.idusuario;
  
  const [profesor, setProfesor] = useState({});
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nivel, setNivel] = useState("");
  const [mensajeActualizado, setMensajeActualizado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const cargarProfesor = async () => {
      console.log("ID Usuario recibido:", idusuario);
      
      if (!idusuario) {
        setError("No se recibió el ID del profesor");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(
          `https://backend-sistema-apoyo-production.up.railway.app/API/AdministradorProfesor/ProfesorID?id=${idusuario}`
        );
        
        console.log("Respuesta API:", response.data);
        
        if (!response.data || !response.data.value) {
          throw new Error("No se encontraron datos del profesor.");
        }
        
        const profesorData = response.data.value;
        setProfesor(profesorData);
        
        
        if (profesorData.nombrecompleto) {
          const nameParts = profesorData.nombrecompleto.split(" ");
          setNombre(nameParts[0] || "");
          setApellido(nameParts.slice(1).join(" ") || "");
        }
        
        setEmail(profesorData.correo || "");
        
      
        const nivelEncontrado = Object.keys(niveles).find(
          key => niveles[key] === profesorData.idnivel
        );
        setNivel(nivelEncontrado || "");
        
      } catch (error) {
        console.error("Error al cargar datos del profesor:", error);
        setError(
          error.response
            ? `Error ${error.response.status}: ${error.response.data.message || "No se pudieron cargar los datos del profesor."}`
            : error.message
        );
      } finally {
        setLoading(false);
      }
    };
    
    cargarProfesor();
  }, [idusuario]);

  const handleActualizar = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!nombre || !apellido || !email || !nivel) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    
    try {
      const nivelId = niveles[nivel];
      if (!nivelId) {
        setError("Nivel no válido");
        return;
      }
      
      const datosActualizados = {
        idusuario: parseInt(idusuario, 10),
        nombrecompleto: `${nombre.trim()} ${apellido.trim()}`,
        contraseñaHash: profesor.contraseñaHash || "",
        fecharegistro: profesor.fecharegistro || new Date().toISOString(),
        correo: email.trim(),
        idnivel: nivelId,
        idrol: profesor.idrol || 1,
        tokenRecuperacion: profesor.tokenRecuperacion || null,
        tokenExpiracion: profesor.tokenExpiracion || null,
        cvRuta: profesor.cvRuta || "",
        fotoRuta: profesor.fotoRuta || "",
      };
      
      console.log("Datos a enviar:", datosActualizados);
      
      const response = await axios.put(
        `https://backend-sistema-apoyo-production.up.railway.app/API/AdministradorProfesor/EditarporID?id=${idusuario}`,
        datosActualizados
      );
      
      console.log("Respuesta actualización:", response.data);
      
      if (response.data.status) {
        setMensajeActualizado("Profesor actualizado con éxito.");
        setTimeout(() => setMensajeActualizado(""), 3000);
        if (typeof onUpdate === "function") onUpdate();
        navigate(-1);
      } else {
        setError(response.data.message || "No se pudo actualizar el profesor.");
      }
    } catch (error) {
      console.error("Error al actualizar el profesor:", error);
      setError(
        error.response
          ? `Error ${error.response.status}: ${error.response.data.message || "Error al actualizar."}`
          : error.message
      );
    }
  };

  const handleCancelar = () => {
    navigate(-1, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-[#00A89F] p-8 text-center relative flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-40 h-auto object-contain mb-4" />
          <h3 className="text-3xl font-bold text-white tracking-wide">Editar Profesor</h3>
        </div>
        
        {mensajeActualizado && (
          <div className="bg-green-500 text-white text-center p-4 animate-pulse">
            {mensajeActualizado}
          </div>
        )}
        
        {error && (
          <div className="bg-red-500 text-white text-center p-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-10 text-center">
            <p className="text-gray-600">Cargando datos del profesor...</p>
          </div>
        ) : !idusuario ? (
          <div className="p-10 text-center">
            <p className="text-red-500 font-medium">
              Error: No se proporcionó un ID de profesor válido
            </p>
            <button
              onClick={handleCancelar}
              className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Volver
            </button>
          </div>
        ) : (
          <form onSubmit={handleActualizar} className="p-10 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                <input
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Profesor</label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A89F] transition-all duration-300"
              >
                <option value="" disabled>Seleccione un nivel</option>
                {Object.keys(niveles).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
           
                className="w-full py-3 bg-[#00A89F] text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-[1.01] shadow-md hover:shadow-lg"
              >
                Actualizar Profesor
              </button>
              <button
                type="button"
                onClick={handleCancelar}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-[1.01] shadow-md hover:shadow-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditarProfesor;