const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/authenticationModel");

require("dotenv").config();

//Loads the jwt key
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

//Sets the token expiration time to 30 minutes
const TOKEN_EXPIRY = "30m";

//Handles user registration
exports.register = (request, response) => {
  //Extracts the user's email and password
  const { email, password } = request.body;

  //Checks if the email and password fields are present and rasises an error if they are not
  if (!email || !password)
    return response
      .status(400)
      .json({ error: "Missing fields. Please provide an email and password" });

  //Encrypts the password using bcrypt
  const hash = bcrypt.hashSync(password, 10);

  //Adds the user's login info to the user database
  db.run(
    `INSERT INTO users (email, password) VALUES (?, ?)`,
    [email, hash],
    (err) => {
      //Raises an error if the user's email is already in the database
      if (err)
        return response.status(400).json({ error: "User already exists" });

      response.json({ message: "Registration for TigerTix is successful" });
    }
  );
};

//Handles user login
exports.login = (request, response) => {
  //Extracts the user's email and password
  const { email, password } = request.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    //Raises an error if the user's email is not in the database
    if (err || !user)
      return response.status(400).json({ error: "Invalid login information" });

    //Raises an error if the password is incorrect
    if (!bcrypt.compareSync(password, user.password))
      return response.status(400).json({ error: "Invalid password" });

    //Generates a jwt token for the user's login
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });

    response.json({ message: "Login to TigerTix is successful", token });
  });
};

//Handles logout
exports.logout = (request, response) => {
  //Clears the user's token cookie
  response.clearCookie("token");

  response.json({ message: "Sucessfully logged out from TigerTix" });
};
