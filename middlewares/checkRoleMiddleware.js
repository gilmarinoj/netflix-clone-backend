// middleware/authorizeRole.js

module.exports = (roles) => { // 'roles' será un array, ej: ['admin']
    return (req, res, next) => {
        // req.user viene del middleware de autenticación (authMiddleware)
        // que ya decodificó el JWT y adjuntó los datos del usuario.
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Acceso denegado. No hay información de rol.' });
        }

        // Verificar si el rol del usuario está incluido en los roles permitidos
        if (roles.includes(req.user.role)) {
            next(); // El usuario tiene un rol permitido, continuar
        } else {
            // El usuario no tiene un rol permitido
            res.status(403).json({ message: 'Acceso no autorizado. Permisos insuficientes.' });
        }
    };
};