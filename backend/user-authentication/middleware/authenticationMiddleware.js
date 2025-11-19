//Jsonwebtoken used for validating jwt
const jwt = require("jsonwebtoken");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

module.exports = (request, response, next) => {
  // Retrieve token from HTTP-only cookie OR Authorization header
  const token =
    request.cookies?.token || request.headers["authorization"]?.split(" ")[1];

  // If no token exists
  if (!token) return response.status(401).json({ error: "Unauthorized" });

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET);

    request.user = decoded;
    next();
  } catch (err) {
    // Handle expiration (required by rubric)
    if (err.name === "TokenExpiredError") {
      return response.status(401).json({ error: "Token expired" });
    }

    console.log("Token from cookie:", request.cookies?.token);
    console.log("Token from header:", request.headers["authorization"]);

    // Any other invalid token case
    return response.status(403).json({ error: "Token invalid" });
  }
};
