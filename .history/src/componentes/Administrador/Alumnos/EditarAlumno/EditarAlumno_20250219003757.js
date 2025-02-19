import React, { useEffect, useState } from "react";
import logo from "../../../../logo/LogoInicio.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const niveles = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
};

export const EditarAlumno = ({ onUpdate }) => {
    const location = useLocation();
    const idusuario = location.state?.idusuario;

    const [alumno, setAlumno] = useState([]);
    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [nivel, setNivel] = useState("");
    const [mensajeActualizado, setMensajeActualizado] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const cargarAlumno = async () => {
            if (!idusuario) return;
            try {
                const response = await axios.get(
                    `https://backend-sistema-apoyo-production.up.railway.app/API/AdministradorAlumno/AlumnoID?id=${idusuario}`
                );
                
                if (!response.data || !response.data.value) throw new Error("No se encontraron datos del alumno.");
                const alumnoData = response.data.value;

                const [nombre, ...apellidoPartes] = alumnoData.nombrecompleto.split(" ");
                setNombre(nombre || "");
                setApellido(apellidoPartes.join(" "));
                setEmail(alumnoData.correo || "");
                setNivel(Object.keys(niveles).find(key => niveles[key] === alumnoData.idnivel) || "");
                setAlumno(alumnoData);
            } catch (error) {
                if (error.response) {
                    alert(`Error ${error.response.status}: ${error.response.data.message || "No se pudieron cargar los datos del alumno."}`);
                } else {
                    alert(error.message);
                }
            }finally{
                setLoading(false);
            }
        };
        cargarAlumno();
    }, [idusuario]);

    const handleActualizar = async (e) => {
        e.preventDefault();
        if (!nombre || !apellido || !email || !nivel) {
            alert("Todos los campos son obligatorios.");
            return;
        }
        try {
            const nivelId = niveles[nivel];
            const datosActualizados = {
                idusuario: parseInt(idusuario, 10),
                nombrecompleto: `${nombre.trim()} ${apellido.trim()}`,
                contraseñaHash: alumno.contraseñaHash,
                fecharegistro: alumno.fecharegistro,
                correo: email.trim(),
                idnivel: nivelId,
                idrol: 2,
                tokenRecuperacion: alumno.tokenRecuperacion,
                tokenExpiracion: alumno.tokenExpiracion,
                cvRuta: alumno.cvRuta,
                fotoRuta: alumno.fotoRuta,
            };
            const response = await axios.put(
                `http://localhost:5228/API/AdministradorAlumno/EditarporID?id=${idusuario}`,
                datosActualizados
            );
            if (response.data.status) {
                setMensajeActualizado("Alumno actualizado con éxito.");
                setTimeout(() => setMensajeActualizado(""), 2000);
                if (typeof onUpdate === "function") onUpdate();
            } else {
                alert("No se pudo actualizar el alumno.");
            }
        } catch (error) {
            console.error("Error al actualizar el alumno:", error);
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
                    <h3 className="text-3xl font-bold text-white tracking-wide">Editar Alumno</h3>
                </div>

                {mensajeActualizado && (
                    <div className="bg-[#00A89F] text-white text-center p-4 animate-pulse">
                        {mensajeActualizado}
                    </div>
                )}

                { loading ? (
                    <p>Cargando datos...</p>
                ) : (
                    
                <form onSubmit={handleActualizar} className="p-10 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                            <input value={nombre} onChange={(e) => setNombre(e.target.value)}
                                type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#00A89F]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                            <input value={apellido} onChange={(e) => setApellido(e.target.value)}
                                type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#00A89F]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)}
                            type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#00A89F]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                        <select value={nivel} onChange={(e) => setNivel(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#00A89F]">
                            <option value="" disabled>Seleccione un nivel</option>
                            <option value="A1">A1: Principiante</option>
                            <option value="A2">A2: Básico</option>
                            <option value="B1">B1: Pre-intermedio</option>
                            <option value="B2">B2: Intermedio</option>
                            <option value="C1">C1: Intermedio-alto</option>
                            <option value="C2">C2: Avanzado</option>
                        </select>
                    </div>
                    <div className="flex space-x-4 pt-4">
                        <button type="submit" className="w-full py-3 bg-[#00A89F] text-white rounded-lg hover:bg-opacity-90">
                            Actualizar Alumno
                        </button>
                        <button type="button" onClick={handleCancelar}
                            className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                            Cancelar
                        </button>
                    </div>
                </form>
                )}
            </div>
        </div>
    );
};

export default EditarAlumno;