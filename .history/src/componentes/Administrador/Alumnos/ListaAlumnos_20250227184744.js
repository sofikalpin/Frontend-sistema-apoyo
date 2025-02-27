import React, { useEffect, useState } from "react";
import TablaAlumnos from "./TablaAlumnos/TablaAlumnos.js";
import axios from "axios";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Header from "../../inicio/Componentes/Header.js";
import Footer from "../../inicio/Componentes/Footer.js";

const ListaAlumnos = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [mensajeEliminacion, setMensaje] = useState("");
    const [deleting, setDeleting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlumnos = async () => {
            setLoading(true);
            try {
                const response = await axios.get("https://backend-sistema-apoyo-production.up.railway.app/API/AdministradorAlumno/ListaAlumnos");
                if (response.data.status && Array.isArray(response.data.value)) {
                    setAlumnos(response.data.value);
                } else {
                    console.error("Error al cargar los alumnos: " + response.data.message);
                    setError("No se pudo cargar la lista de alumnos");
                }
            } catch (error) {
                console.error("Error al cargar los alumnos: ", error);
                setError("Error al conectar con el servidor.");
            } finally {
                setLoading(false);
            }
        };
        fetchAlumnos();
    }, []);

    const alumnosFiltro = alumnos.filter((alumno) => 
        alumno.nombrecompleto?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleDeleteAlumno = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este alumno?")) {
            setDeleting(true);
            axios.delete(`https://backend-sistema-apoyo-production.up.railway.app/API/AdministradorAlumno/EliminarAlumno?id=${id}`)
                .then(() => {
                    setAlumnos((prevAlumnos) => prevAlumnos.filter((alumno) => alumno.idusuario !== id));
                    console.log("Alumno eliminado con éxito.");
                    setMensaje("Alumno eliminado con éxito.");
                    setTimeout(() => setMensaje(""), 2000);
                })
                .catch((error) => {
                    console.error("Error al eliminar el alumno: ", error);
                    alert("Ocurrió un error al eliminar el alumno. Por favor, intenta nuevamente.");
                })
                .finally(() => {
                    setDeleting(false);
                });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-100">
            <Header />

            <div className="flex items-center justify-start w-full mt-4 px-4 sm:px-6 md:px-10 lg:px-20">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                    <ArrowLeft className="w-6 h-6" />
                    <span>Volver</span>
                </button>
            </div>

            <div className="flex flex-col items-center mt-8 px-4 sm:px-6 md:px-10 lg:px-20 max-w-7xl mx-auto w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Lista de Alumnos Registrados</h1>

                <input
                    type="text"
                    placeholder="Buscar alumno por nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full max-w-lg p-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    autoComplete="off"
                />

                <div className="w-full overflow-x-auto">
                    {mensajeEliminacion && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-center">{mensajeEliminacion}</div>}
                    {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">{error}</div>}
                    {loading ? (
                        <div className="text-center text-gray-500">Cargando...</div>
                    ) : (
                        <TablaAlumnos data={alumnosFiltro} onDelete={handleDeleteAlumno} deleting={deleting} />
                    )}
                </div>
            </div>
            <div className="mb-16"></div>
            <Footer role="administrador" />
        </div>
    );
};

export default ListaAlumnos;
