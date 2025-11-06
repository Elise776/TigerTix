const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

module.exports = (request, response, next) => 
{
    const token = request.cookies?.token || request.headers['authorization']?.split(' ')[1];
    if (!token) return response.status(401).json({ error: 'Unauthorized' });

    try 
    {
        const decoded = jwt.verify(token, JWT_SECRET);
        request.user = decoded;
        next();
    } 
    catch 
    {
        return response.status(403).json({ error: 'Token expired or invalid' });
    }
};
