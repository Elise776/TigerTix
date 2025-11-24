const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/authenticationModel");

require("dotenv").config();

//Set jwt secret
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

//Set token expiration
const TOKEN_EXPIRY = "30m";

//Allows user to register for TigerTix
exports.register = (request, response) => 
{
  const { email, password } = request.body;

  if (!email || !password)
  {
    return response
      .status(400)
      .json({ error: "Missing fields. Please provide an email and password" });
  }

  //Hashes password for secure storage
  const hash = bcrypt.hashSync(password, 10);

  //Stores user and hashed password in database
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

//Allows user to login to TigerTix
exports.login = (request, response) => 
{
  const { email, password } = request.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    //Checks for valid user
    if (err || !user)
    {
      return response.status(400).json({ error: "Invalid login information" });
    }
    
    //Checks for valid password
    if (!bcrypt.compareSync(password, user.password))
    {
      return response.status(400).json({ error: "Invalid password" });
    }

    //Generates a token for the user
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {expiresIn: TOKEN_EXPIRY,});

    //Creates a cookie
    response.cookie("token", token, {httpOnly: true, secure: true, sameSite: "none",maxAge: 30 * 60 * 1000,});

    return response.json({message: "Login successful",token,});
  });
};

//Allows user to logout from TigerTix
exports.logout = (request, response) => 
{
  //Clears the token cookie
  response.clearCookie("token", {httpOnly: true, secure: true, sameSite: "none",});

  response.json({ message: "Successfully logged out from TigerTix" });
};
