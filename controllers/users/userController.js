const User = require('../../models/users/user');
const bcrypt = require('bcryptjs');

// Crear usuario

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Necesitas llenar todos los campos: name, email, password' });
    }

    try {
        const userExists = await User.findOne({ where: { email: email } });

        if (userExists) {
            return res.status(400).json({ message: 'El correo ya esta registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Crear usuario en la BD
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashPassword,
        });

        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: userResponse
        })

    } catch (error) {
        console.error('Error al crear el usuario:', error);

        // Sequelize puede lanzar errores específicos, por ejemplo, si la validación falla
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'El email ya está registrado.', error: error.message });
        }
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Error de validación: ' + error.errors[0].message, error: error.message });
        }

        res.status(500).json({ message: 'Error interno del servidor al crear el usuario.', error: error.message });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ where: { 'is_active': true }, attributes: ['id', 'name', 'email', 'role'] }); // Excluye la contraseña
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: ['id', 'name', 'email', 'role', 'is_active'] });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        await user.update({ is_active: false });
        res.json({ message: 'Usuario eliminado exitosamente.' });

    } catch (error) {

    }
}