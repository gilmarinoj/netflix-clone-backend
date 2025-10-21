const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Movie = sequelize.define('Movie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    release_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    director: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: true,
        defaultValue: 0.0,
        validate: {
            min: 0.0,
            max: 10.0
        }
    },
    trailer_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    video_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    thumbnail_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    poster_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'movies'
});


module.exports = Movie;