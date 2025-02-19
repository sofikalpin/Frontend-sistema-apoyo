import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import CrearChat from "../crearChat/crearChat.js";
import nuevoChatIcon from "../chatIcons/newChatIcon.png";

const ListaChats = ({ onSelectChat }) => {
    const [chats, setChats] = useState([]);
    const [receptor, setReceptor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [rolseleccionado, setRolseleccionado] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const idusuario = 5;

    useEffect(() => {
        const cargarChats = async () => {
            setLoading(true);
            try {
                const respuesta = await axios.get(
                    `http://localhost:5228/API/Chat/ChatporUsuarioID?userId=${idusuario}`
                );
                setChats(respuesta.data.value);

                const idsUsuarios = respuesta.data.value.map(chat => chat.idusuario2);
                const datosUsuarios = await Promise.all(
                    idsUsuarios.map(async (id) => {
                        const usuarioResp = await axios.get(
                            `http://localhost:5228/API/Usuario/BuscarUsuario?idUsuario=${id}`
                        );
                        return { id, ...usuarioResp.data.value };
                    })
                );

                const usuarioMap = {};
                datosUsuarios.forEach(receptor => {
                    usuarioMap[receptor.id] = receptor;
                });
                setReceptor(usuarioMap);
            } catch (error) {
                console.error("Error al obtener los datos del chat: ", error);
                setError("No se pudo cargar la lista de chats.");
            } finally {
                setLoading(false);
            }
        };
        
        cargarChats();
    }, []);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const agregarChat = (nuevoChat) => {
        setChats(prev => [...prev, nuevoChat]);
        closeModal();
    };

    const chatsFiltrados = chats.filter(chat => {
        const nombreCoincide = receptor[chat.idusuario2]?.nombrecompleto?.toLowerCase().includes(busqueda.toLowerCase());
        const rolCoincide = rolseleccionado === "" || receptor[chat.idusuario2]?.idrol === parseInt(rolseleccionado, 10);
        return nombreCoincide && rolCoincide;
    });

    const handleRolSeleccionado = (e) => {
        setRolseleccionado(e.target.value);
    };

    if (loading) {
        return <p className="text-center text-gray-500">Cargando chats...</p>;
    }
    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Mis Chats</h2>
                <button onClick={openModal} className="bg-blue-500 p-2 rounded-full shadow-md hover:bg-blue-600">
                    <img src={nuevoChatIcon} alt="Nuevo Chat" className="w-6 h-6" />
                </button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Crear Nuevo Chat"
                className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto"
                overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
                ariaHideApp={false}
            >
                <CrearChat idusuario={idusuario} onChatCreado={agregarChat} onClose={closeModal} />
            </Modal>
            
            <label htmlFor="rol-select" className="block text-sm font-medium text-gray-700">Filtro por rol:</label>
            <select
                id="rol-select"
                value={rolseleccionado}
                onChange={handleRolSeleccionado}
                className="block w-full p-2 border rounded mt-1 mb-4"
            >
                <option value="">Todos</option>
                <option value="1">Profesores</option>
                <option value="2">Alumnos</option>
                <option value="3">Administrador</option>
            </select>
            
            <input 
                type="text"
                placeholder="Buscar nombre del chat..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                autoComplete="off"
            />

            {chatsFiltrados.length === 0 ? (
                <p className="text-center text-gray-500">No se encontraron chats activos.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {chatsFiltrados.map(chat => (
                        <li 
                            key={chat.idchat} 
                            onClick={() => onSelectChat(chat)}
                            className="p-2 cursor-pointer hover:bg-gray-100 rounded"
                        >
                            {receptor[chat.idusuario2]?.nombrecompleto || "Usuario"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListaChats;
