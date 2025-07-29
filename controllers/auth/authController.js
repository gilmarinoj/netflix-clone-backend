const User = require('../../models/users/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRO

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Debes llenar todos los campos: name, email, password' });
    }

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashear Password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role: 'user',
            is_active: true,
        });

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                is_active: newUser.is_active,
            }
        })
    } catch (error) {
        console.error('Error al registrar', error);
        res.status(500).json({ message: 'Error Interno del Servidor' });
    }
}

// LOGIN

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Debes llenar todos los campos' });
    }

    try {
        //Buscar usuario
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Correo o Password incorrecto' });
        }
        
        //Validar Password
        const isMatch = await bcrypt.compare(password, user.password);
        if( !isMatch ) {
            return res.status(400).json({ message: 'Correo o Password incorrecto' });   
        }

        //Generar token
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (error, token) => {
                if (error) throw error;
                res.status(200).json({
                    message: 'Login exitoso',
                    token
                });
            }
        )
    } catch (error) {
        console.error('Error al iniciar sesion', error);
        res.status(500).json({ message: 'Error Interno del Servidor' });
    }
}