const jwt = require('jsonwebtoken');

module.exports = function( req, res, next ) {
    const authHeader = req.header('Authorization');

    if( !authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;
        next();
    } catch (error) {
        console.error('Error al verificar el token: ', error.message)
        return res.status(401).json({ message: 'Token no valido' });
    }
}