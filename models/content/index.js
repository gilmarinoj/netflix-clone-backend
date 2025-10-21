const Movie = require("./movie.js");
const Genre = require('./genre.js');

Movie.belongsToMany(Genre, {
    through: 'MovieGenres',
    foreignKey: 'movie_id',
    otherKey: 'genre_id',
    as: 'genres'
});

Genre.belongsToMany(Movie, {
    through: 'MovieGenres',
    foreignKey: 'genre_id',
    otherKey: 'movie_id',
    as: 'movies'
});

module.exports = { Movie, Genre };