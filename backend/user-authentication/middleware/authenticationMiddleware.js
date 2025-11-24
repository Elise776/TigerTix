//Jsonwebtoken used for validating jwt
const jwt = require("jsonwebtoken");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

module.exports = (request, response, next) => 
{
  //Gets token
  const token = request.cookies?.token || request.headers["authorization"]?.split(" ")[1];

  //Throws an error if no token is found
  if (!token) 
  {
    return response.status(401).json({ error: "Unauthorized" });
  }
  
  try 
  {
    //Decodes token
    const decoded = jwt.verify(token, JWT_SECRET);
    request.user = decoded;
    next();
  } 
  catch (err) 
  {
    //Raises error if token is expired
    if (err.name === "TokenExpiredError") 
    {
      return response.status(401).json({ error: "Token expired" });
    }

    console.log("Token from cookie:", request.cookies?.token);
    console.log("Token from header:", request.headers["authorization"]);

    return response.status(403).json({ error: "Token invalid" });
  }
};
