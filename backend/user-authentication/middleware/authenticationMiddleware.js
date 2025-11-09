//Jsonwebtoken used for validating jwt
const jwt = require('jsonwebtoken');

require('dotenv').config();

//Loads the jwt key
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

module.exports = (request, response, next) => 
{
    //Retrieves the jwt token
    const token = request.cookies?.token || request.headers['authorization']?.split(' ')[1];

    //Raises an error if a toxen does not exist
    if (!token) 
        return response.status(401).json({ error: 'Unauthorized' });

    try 
    {
        //Verifies the token using the secret key and decodes it
        const decoded = jwt.verify(token, JWT_SECRET);

        request.user = decoded;
        
        //Goes to the route handler in authenticationRoutes
        next();
    } 
    catch 
    {
        //Raises an error if the token is invalid
        return response.status(403).json({ error: 'Token invalid' });
    }
};
