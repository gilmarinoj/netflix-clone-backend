// Importar dependencias
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Importar Modulos
const sequelize = require('./config/database.js');
const indexRoutes = require('./routes/indexRoutes.js');
const usersRoutes = require('./routes/users/userRoutes.js');
const authRoutes = require('./routes/auth/authRoutes.js');
const movieRoutes = require('./routes/content/movieRoutes.js');
const authMiddleware = require('./middlewares/authMiddleware.js');
const checkRoleMiddleware = require('./middlewares/checkRoleMiddleware.js');


// JSON y URL Encoded Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexion a la base de datos
sequelize.authenticate()
    .then(() => {
        console.log('Database Connected');
        return sequelize.sync({ force: false });
    })
    .then(() => {
        console.log('Database sync');
    })
    .catch(err => {
        console.error('No se pudo conectar o sincronizar a la base de datos');
        process.exit(1);
    })

// Importar Rutas
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', [authMiddleware, checkRoleMiddleware(['admin'])], usersRoutes);
app.use('/api/content/movies', [authMiddleware], movieRoutes);

// Correr el servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});