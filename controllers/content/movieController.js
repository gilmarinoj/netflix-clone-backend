const Movie = require('../../models/content/movie');

exports.createMovie = async (req, res) => {
    const { title,
        description,
        release_date,
        duration_minutes,
        director,
        rating,
        trailer_url,
        video_url,
        thumbnail_url,
        poster_url,
        is_featured,
        is_active } = req.body;

        if(!title || !description || !release_date || !duration_minutes || !director || !rating) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios: title, description, release_date, duration_minutes, director, rating' });
        }

        if(!Number.isInteger(duration_minutes) || duration_minutes <= 0) {
            return res.status(400).json({ message: 'La duracion debe ser un numero entero positivo'});
        }

        // Validar que la película no exista
        if (await Movie.findOne({where: { title: title}})) {
            return res.status(400).json({ message: 'Esta pelicula ya esta registrada'});
        }

        try {
            const newMovie = await Movie.create({
                title,
                description,
                release_date,
                duration_minutes,
                director,
                rating,
                trailer_url,
                video_url,
                thumbnail_url,
                poster_url,
                is_featured: is_featured || false,
                is_active: is_active || true
            });

            res.status(201).json({
                message: 'Película creada exitosamente',
                movie: {
                    id: newMovie.id,
                    title: newMovie.title,
                    description: newMovie.description,
                    release_date: newMovie.release_date,
                    duration_minutes: newMovie.duration_minutes,
                    director: newMovie.director,
                    rating: newMovie.rating,
                    trailer_url: newMovie.trailer_url,
                    video_url: newMovie.video_url,
                    thumbnail_url: newMovie.thumbnail_url,
                    poster_url: newMovie.poster_url,
                    is_featured: newMovie.is_featured,
                    is_active: newMovie.is_active
                }
            });
        } catch (error) {
            console.error('Error al crear la pelicula', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ message: 'El título ya está registrado.', error: error.message });
            }
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ message: 'Error de validación: ' + error.errors[0].message, error: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor al crear la película.', error: error.message });
        }
}

exports.getAllMovies = async(req, res) => {
    try {
        const movies = await Movie.findAll({
            where: { is_active: true}, 
            attributes: ['id', 'title', 'description', 'release_date', 'duration_minutes', 'director', 'rating', 'trailer_url', 'video_url', 'thumbnail_url', 'poster_url', 'is_featured']
        });
        res.json(movies);
    } catch (error) {
        console.error('Error al obtener las peliculas:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}




