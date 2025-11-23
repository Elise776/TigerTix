const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/authenticationModel");

require("dotenv").config();

// JWT secret and expiry
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const TOKEN_EXPIRY = "30m";

// REGISTER (no cookie set here)
exports.register = (request, response) => {
  const { email, password } = request.body;

  if (!email || !password)
    return response
      .status(400)
      .json({ error: "Missing fields. Please provide an email and password" });

  const hash = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (email, password) VALUES (?, ?)`,
    [email, hash],
    (err) => {
      if (err)
        return response.status(400).json({ error: "User already exists" });

      return response.json({ message: "Registration successful" });
    }
  );
};

// LOGIN (sets secure cookie properly)
exports.login = (request, response) => {
  const { email, password } = request.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user)
      return response.status(400).json({ error: "Invalid login information" });

    if (!bcrypt.compareSync(password, user.password))
      return response.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    response.cookie("token", token, {
      httpOnly: true,
      secure: true,      // REQUIRED for HTTPS
      sameSite: "none",  // REQUIRED for cross-site cookies
      maxAge: 30 * 60 * 1000,
    });

    return response.json({
      message: "Login successful",
      token,
    });
  });
};

// LOGOUT
exports.logout = (request, response) => {
  response.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  response.json({ message: "Successfully logged out from TigerTix" });
};
