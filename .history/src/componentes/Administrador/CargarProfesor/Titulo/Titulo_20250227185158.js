import React from "react";
import logo from "../../../../logo/LogoInicio.png";

const Titulo = ({ cantidad }) => {
    return (
        <div className="flex items-center space-x-4 p-4 bg-white shadow-md rounded-lg flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-4">
            <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
            <div className="text-center sm:text-left">
                <h1 className="text-xl font-semibold text-gray-800">Autorizar Profesores</h1>
                <p className="text-gray-600">
                    Solicitudes de autorización: <span className="font-bold text-blue-600">{cantidad}</span>
                </p>
            </div>
        </div>
    );
};

export default Titulo;
