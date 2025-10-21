const Genre = require('../../models/content/genre');

exports.createGenre = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios: name, description' });
    }

    // Validar que la película no exista
    if (await Genre.findOne({ where: { name } })) {
        return res.status(400).json({ message: 'Este genero ya esta registrado' });
    }

    try {
        const newGenre = await Genre.create({
            name,
            description,
            is_active: true
        });

        res.status(201).json({
            message: 'Genero creado exitosamente',
            genre: {
                id: newGenre.id,
                name: newGenre.name,
                description: newGenre.description
            }
        })

    } catch (error) {
        console.error('Error al crear el genero', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'El genero ya está registrado.', error: error.message });
        }
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Error de validación: ' + error.errors[0].message, error: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear el genero.', error: error.message });
    }
}

exports.getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.findAll({
            where: { is_active: true },
            attributes: ['id', 'name', 'description']
        });
        res.json(genres);
    } catch (error) {
        console.error('Error al obtener los generos:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}