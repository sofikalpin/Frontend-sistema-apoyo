import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarAlumno from "../EditarAlumno/EditarAlumno";

const FilaAlumnos = ({ alumno, onDelete, deleting }) => {
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!alumno?.idusuario) {
            console.error("El idusuario del alumno no está definido o es inválido.");
            return;
        }
        navigate("editarAlumno", { state: { idusuario: alumno.idusuario } });
        setMostrarEditar(true);
    };

    const controlarEliminar = () => {
        const confirmarEliminar = window.confirm(`¿Desea eliminar al profesor ${alumno.nombrecompleto}?`);
        if (confirmarEliminar) {
            onDelete(alumno.idusuario);
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
        <tr className="border-b hover:bg-gray-50 transition-colors flex flex-col sm:table-row">
            <td className="px-2 py-2 sm:px-4 flex items-center justify-between border-b sm:border-b-0 sm:table-cell">
                <div className="flex items-center">
                    <span className="inline-block w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs sm:text-sm">
                        {iniciales(alumno.nombrecompleto)}
                    </span>
                    <span className="ml-2 text-sm sm:text-base">{alumno.nombrecompleto}</span>
                </div>
                <div className="sm:hidden">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded">
                        {nivelInicial(alumno.idnivel)}
                    </span>
                </div>
            </td>
            <td className="px-2 py-2 sm:px-4 text-sm sm:text-base border-b sm:border-b-0 sm:table-cell">
                <div className="sm:hidden font-medium text-xs text-gray-500 mb-1">Correo:</div>
                {alumno.correo}
            </td>
            <td className="px-2 py-2 sm:px-4 border-b sm:border-b-0 hidden sm:table-cell">
                <span className="text-sm font-semibold text-gray-700">
                    {nivelInicial(alumno.idnivel)}
                </span>
            </td>
            <td className="px-2 py-2 sm:px-4 sm:py-2 flex flex-wrap gap-2 justify-center sm:justify-start sm:table-cell">
                <div className="w-full sm:w-auto flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                        className="bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
                        onClick={handleNavigate}
                        disabled={deleting}
                    >
                        Editar
                    </button>

                    {mostrarEditar && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl overflow-auto max-h-screen">
                                <EditarAlumno 
                                    idusuario={alumno.idusuario} 
                                    onUpdate={handleUpdate} 
                                />
                            </div>
                        </div>
                    )}

                    <button 
                        className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                        onClick={controlarEliminar}
                        disabled={deleting}
                    >
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default FilaAlumnos;
