import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarAlumno from "../EditarAlumno/EditarAlumno.js";

const FilaAlumnos = ({ alumno, onDelete }) => {
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!alumno?.idusuario) {
            console.error("El idusuario del alumno no está definido o es inválido.");
            return;
        }
        console.log("El idusuario: " + alumno.idusuario);
        navigate("editarAlumno", {state: { idusuario: alumno.idusuario}});
        setMostrarEditar(true);
    };

    const controlarEliminar = () => {
        const confirmarEliminar = window.confirm(`¿Está seguro de que desea eliminar al alumno ${alumno.nombrecompleto}?`);
        if (confirmarEliminar) {
            setEliminando(true);
            
            fetch(`https://backend-sistema-apoyo-production.up.railway.app/API/AdministradorAlumno/EliminarAlumno?id=${alumno.idusuario}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log("Alumno eliminado con éxito");
                    // Notificar al componente padre para actualizar la lista
                    onDelete(alumno.idusuario);
                } else {
                    console.error("Error al eliminar alumno:", response.status);
                    alert("No se pudo eliminar al alumno. Código de error: " + response.status);
                }
            })
            .catch(error => {
                console.error("Error en la petición:", error);
                alert("Error de conexión al servidor. Por favor, inténtelo nuevamente.");
            })
            .finally(() => {
                setEliminando(false);
            });
        }
    };

    const iniciales = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();
    };

    const nivelInicial = (nivelId) => {
        const niveles = {
            "1": "A1",
            "2": "A2",
            "3": "B1",
            "4": "B2",
            "5": "C1",
            "6": "C2",
        };
        return niveles[nivelId] || "Desconocido";
    };

    const handleUpdate = () => {
        console.log("Alumno actualizado");
        setMostrarEditar(false); 
    };

    return (
        <>
            <tr className="border-b">
                <td className="px-4 py-2">
                    <div className="flex items-center">
                        <span className="inline-block w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center">
                            {iniciales(alumno.nombrecompleto)}
                        </span>
                        <span className="ml-2">{alumno.nombrecompleto}</span>
                    </div>
                </td>
                <td className="px-4 py-2">{alumno.correo}</td>
                <td className="px-4 py-2">
                    <span className="text-sm font-semibold text-gray-700">{nivelInicial(alumno.idnivel)}</span>
                </td>
                <td className="px-4 py-2 flex space-x-2">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={handleNavigate}
                        disabled={eliminando}
                    >
                        Editar
                    </button>
                    {mostrarEditar && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <EditarAlumno idusuario={alumno.idusuario} onUpdate={handleUpdate} />
                            </div>
                        </div>
                    )}
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        onClick={controlarEliminar}
                        disabled={eliminando}
                    >
                        {eliminando ? "Eliminando..." : "Eliminar"}
                    </button>
                </td>
            </tr>
        </>
    );
};

export default FilaAlumnos;