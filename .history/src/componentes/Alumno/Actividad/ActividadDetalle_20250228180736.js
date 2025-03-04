import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import logoactividad from "../Imagenes/actividades.png";
import { ArrowLeft } from "lucide-react";
import Header from "../../inicio/Componentes/Header";
import Footer from "../../inicio/Componentes/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";

const ActividadDetalle = () => {
  const { idactividad } = useParams();
 

  const [loading, setLoading] = useState(false);
  const [actividad, setActividad] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    
    const encontrarActividad = async () => {
      try {
        setLoading(true);
        const respuesta = await axios.get(`https://backend-sistema-apoyo-production.up.railway.app/API/Actividad/ActividadID?id=${idactividad}`);
        if (respuesta.data.status) {
          setActividad(respuesta.data.value);
        } else {
          setError(respuesta.data.message);
        }
      } catch (error) {
        setError("Error al conectar con el servidor, inténtelo más tarde.");
        setActividad("");
      } finally {
        setLoading(false);
      }
    } 

    encontrarActividad();
  }, [idactividad]);

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
     
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Volver</span>
        </button>

   
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">

        
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <span className="text-gray-600">Fecha de Publicacion: {actividad.fechaCreacion || "No posee fecha"}</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">{actividad?.nombre}</h1>

      
          <div className="mt-6 flex justify-center">
            <img src={logoactividad} alt="Actividad" className="w-40 h-auto rounded-lg shadow-md mx-auto my-4" />
          </div>

         
          <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Descripción</h2>
              <ReactMarkdown className="text-gray-600 text-justify" breaks={true}>
                {actividad?.descripcion}
              </ReactMarkdown>
            </div>

         
          <div className="border-t border-gray-200 mt-8 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Archivo de la Actividad</h2>
            
       
            {actividad?.url ? (
              <a
                href={actividad.url}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(actividad.url, "_blank");
                }}
                className="py-2 px-6 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md"
              >
                Ver archivo
              </a>
            ) : (
              <p className="text-gray-500 italic">Esta actividad no posee ningún archivo adjunto</p>
            )}
          </div>
        </div>
      </main>
      <Footer role = "alumno" />
    </div>
  );
};

export default ActividadDetalle;