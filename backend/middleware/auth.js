const jwt = require('jsonwebtoken');

// Clave secreta para firmar los JWT. En producción debería estar en el archivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'fundacredesa_super_secret_key_2024';

// Middleware 1: IP Whitelist Firewall
const ipWhitelistMiddleware = (req, res, next) => {
    // Si la lista está vacía en .env, por defecto solo permite localhost (IPv4/IPv6)
    const allowedIps = process.env.ALLOWED_ADMIN_IPS ? process.env.ALLOWED_ADMIN_IPS.split(',') : ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

    let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Si el cliente está autorizado (su IP hace match con la whitelist)
    if (allowedIps.includes(clientIp)) {
        return next();
    }

    console.warn(`[FIREWALL ALERTA] Intento de acceso denegado desde IP no autorizada: ${clientIp}`);
    return res.status(403).json({ error: 'Acceso Denegado por Firewall: Tu dirección IP no está en la lista blanca de la institución.' });
};

// Middleware 2: Verificación de JWT Bearer Token
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(401).json({ error: 'Acceso Denegado: Se requiere un token de sesión Authentication Bearer.' });
    }

    const token = bearerHeader.split(' ')[1]; // Formato "Bearer eyJhb..."

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Guardamos los datos del administrador resueltos
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.' });
    }
};

module.exports = { ipWhitelistMiddleware, verifyToken, JWT_SECRET };
