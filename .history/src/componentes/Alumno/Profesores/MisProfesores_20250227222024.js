const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener opiniones y calificación promedio de un profesor
router.get('/:idProfesor/opiniones', async (req, res) => {
    try {
        const { idProfesor } = req.params;

        // Validar que el idProfesor sea un número
        if (isNaN(idProfesor)) {
            return res.status(400).json({ error: 'ID de profesor inválido' });
        }

        // Obtener opiniones del profesor
        const opiniones = await db.query(
            'SELECT id, idUsuario, opinion, calificacion FROM opiniones WHERE idProfesor = ?',
            [idProfesor]
        );

        // Calcular la calificación promedio
        const promedio = opiniones.length > 0
            ? opiniones.reduce((sum, op) => sum + op.calificacion, 0) / opiniones.length
            : 0;

        res.json({ opiniones, promedio: promedio.toFixed(2) });
    } catch (error) {
        console.error('Error al obtener opiniones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Agregar una opinión
router.post('/:idProfesor/opiniones', async (req, res) => {
    try {
        const { idProfesor } = req.params;
        const { idUsuario, opinion, calificacion } = req.body;

        // Validar datos de entrada
        if (!idUsuario || !opinion || isNaN(calificacion) || calificacion < 1 || calificacion > 5) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        // Insertar la opinión en la base de datos
        await db.query(
            'INSERT INTO opiniones (idProfesor, idUsuario, opinion, calificacion) VALUES (?, ?, ?, ?)',
            [idProfesor, idUsuario, opinion, calificacion]
        );

        res.status(201).json({ message: 'Opinión agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar opinión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
