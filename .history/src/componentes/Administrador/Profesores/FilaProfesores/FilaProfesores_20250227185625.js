import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditarProfesor from "../EditarProfesor/EditarProfesor";
import axios from "axios";

const FilaProfesores = ({ profesor, onDelete }) => {
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();

    const toggleTooltip = () => {
        setShowTooltip(prevState => !prevState);
    };

    const handleNavigate = () => {
        if (!profesor?.idusuario) {
            console.error("El idusuario del profesor no esta definido o es invalido");
            return;
        }
        navigate("editarProfesor", { state: { idusuario: profesor.idusuario } });
        setMostrarEditar(true);
    };

    const controlarEliminar = () => {
        const confirmarEliminar = window.confirm(`¿Desea eliminar al profesor ${profesor.nombrecompleto}?`);
        if (confirmarEliminar) {
            onDelete(profesor.idusuario);
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
        return niveles[nivelId] || " ";
    };

    const handleUpdate = () => {
        if (typeof onUpdate !== 'function') {
            console.error("onUpdate no es una función");
            return;
        }
        setMostrarEditar(false);
    };

    const obtenerCV = async (idUsuario) => {
        try {
            const response = await axios.get(`https://backend-sistema-apoyo-production.up.railway.app/API/Usuario/ObtenerCV?idUsuario=${idUsuario}`, {
                responseType: 'arraybuffer',
            });

            if (response.data && response.data.byteLength > 0) {
                const file = new Blob([response.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);

                const link = document.createElement('a');
                link.href = fileURL;
                link.download = `cv_${idUsuario}.pdf`;
                link.click();
            } else {
                alert("El archivo no está disponible.");
            }
        } catch (error) {
            console.error("Error al obtener el CV", error);
            alert("No se pudo obtener el CV.");
        }
    };

    return (
        <tr className="border-b hover:bg-gray-100">
            <td className="px-4 py-3 flex items-center gap-2 flex-col sm:flex-row">
                <div className="flex items-center">
                    <span className="inline-block w-8 h-8 bg-gray-300 rounded-full text-white flex items-center justify-center text-sm font-bold mr-2">
                        {iniciales(profesor.nombrecompleto)}
                    </span>
                    {profesor.nombrecompleto}
                </div>
            </td>

            <td className="px-4 py-4 text-sm sm:text-base">{profesor.correo}</td>

            <td className="px-4 py-4 text-sm sm:text-base">
                <span className="text-gray-600">{nivelInicial(profesor.idnivel)}</span>
            </td>

            <td className="px-4 py-3 flex justify-end items-center space-x-2 flex-col sm:flex-row">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                    onClick={handleNavigate}
                >
                    Editar
                </button>
                {mostrarEditar && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <EditarProfesor idusuario={profesor.idusuario} onUpdate={handleUpdate} />
                    </div>
                )}
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                    onClick={controlarEliminar}
                >
                    Eliminar
                </button>
                <div className="relative" onClick={toggleTooltip}>
                    <button className="text-gray-500 text-xl">⋮</button>
                    {showTooltip && (
                        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-32">
                            <button
                                className="w-full text-left px-4 py-2 text-blue-600"
                                onClick={() => obtenerCV(profesor.idusuario)}
                            >
                                Ver CV
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default FilaProfesores;
