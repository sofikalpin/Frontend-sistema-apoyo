import React, { useState, useEffect } from "react";
import { useUser } from "../../../Context/UserContext"; 
import Header from "../../inicio/Componentes/Header";
import Footer from "../../inicio/Componentes/Footer";
import { Search, UserRound, MessageCircle, Send, X, Star, CheckCircle } from "lucide-react";

const MisProfesores = () => {
  const { user } = useUser(); 
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [opinionesMap, setOpinionesMap] = useState({}); 
  const [newOpinion, setNewOpinion] = useState("");
  const [ratingsMap, setRatingsMap] = useState({}); 
  const [currentRating, setCurrentRating] = useState(0); 
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await fetch("https://backend-sistema-apoyo-production.up.railway.app/API/AdministradorProfesor/ListaProfesoresAutorizados");
        if (!response.ok) {
          throw new Error("Error al cargar los profesores");
        }
        const data = await response.json();
        const profesoresData = Array.isArray(data.value) ? data.value : [];
        setProfesores(profesoresData);

        const opinionesIniciales = {};
        const ratingsIniciales = {};
        profesoresData.forEach(profesor => {
          opinionesIniciales[profesor.idusuario] = [];
          ratingsIniciales[profesor.idusuario] = 0; 
        });
        setOpinionesMap(opinionesIniciales);
        setRatingsMap(ratingsIniciales);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfesores();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredProfesores = profesores.filter(profesor =>
    profesor.nombrecompleto.toLowerCase().includes(searchTerm)
  );

  const handleAddOpinion = async (profesorId) => {
    if (!newOpinion.trim()) return;

    try {
      const token = sessionStorage.getItem("authToken");

      const requestBody = {
        idReseña: 0,
        idusuario: user.idusuario,
        nombreUsuario: user.nombrecompleto,
        idProfesor: profesorId,
        nombreProfesor: profesores.find(p => p.idusuario === profesorId)?.nombrecompleto || "Desconocido",
        rating: currentRating,
        comentario: newOpinion
      };

      const response = await fetch("https://backend-sistema-apoyo-production.up.railway.app/API/Reseña/CrearReseñaAlumno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error("Error al agregar la opinión");
      }

      // En lugar de actualizar el opinionesMap, mostramos un mensaje de éxito
      setSuccessMessage({
        profesorId,
        profesorName: profesores.find(p => p.idusuario === profesorId)?.nombrecompleto || "Desconocido"
      });

      setNewOpinion("");
      setCurrentRating(0); 
      setSelectedProfesor(null);
      
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (error) {
      setError("Error al agregar la opinión");
    }
  };

  const handleRatingChange = (rating) => {
    setCurrentRating(rating);
  };

  const getOpinionesProfesor = (profesorId) => {
    return opinionesMap[profesorId] || [];
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 cursor-pointer ${i <= currentRating ? "text-yellow-500" : "text-gray-300"}`}
          onClick={() => handleRatingChange(i)}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Profesores</h1>
            <p className="text-gray-600">Encuentra y comparte opiniones sobre tus profesores</p>
          </div>

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Reseña enviada correctamente para {successMessage.profesorName}</span>
            </div>
          )}
        
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar profesor por nombre..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando profesores...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
              {error}
            </div>
          ) : filteredProfesores.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <UserRound className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron profesores.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredProfesores.map((profesor) => {
                const opiniones = getOpinionesProfesor(profesor.idusuario);
                return (
                  <div key={profesor.idusuario} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3">
                          <UserRound className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{profesor.nombrecompleto}</h3>
                          {opiniones.length > 0 && (
                            <p className="text-sm text-gray-500">{opiniones.length} opiniones</p>
                          )}
                        </div>
                      </div>

                      {selectedProfesor === profesor.idusuario ? (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <MessageCircle className="h-5 w-5 text-blue-500" />
                            <span className="font-medium text-gray-700">Nueva opinión</span>
                          </div>
                          <textarea
                            placeholder="¿Qué opinas sobre este profesor?"
                            value={newOpinion}
                            onChange={(e) => setNewOpinion(e.target.value)}
                            className="w-full p-3 rounded-lg border-2 border-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none mb-3"
                            rows="3"
                          />
                          <div className="flex gap-2 mb-3">
                            {renderStars()}
                          </div>
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setSelectedProfesor(null);
                                setNewOpinion("");
                                setCurrentRating(0);
                              }}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <X className="h-4 w-4" />
                              Cancelar
                            </button>
                            <button 
                              onClick={() => handleAddOpinion(profesor.idusuario)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              <Send className="h-4 w-4" />
                              Publicar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setSelectedProfesor(profesor.idusuario)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors w-full justify-center"
                        >
                          <MessageCircle className="h-5 w-5" />
                          Agregar Opinión
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer role = "alumno"/>
    </div>
  );
};

export default MisProfesores;