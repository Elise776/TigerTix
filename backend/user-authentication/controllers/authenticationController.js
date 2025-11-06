const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/authenticationModel');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const TOKEN_EXPIRY = '30m';

exports.register = (request, response) => 
{
    const { email, password } = request.body;
    
    if (!email || !password) return response.status(400).json({ error: 'Missing fields' });

    const hash = bcrypt.hashSync(password, 10);
    
    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hash], err => 
    {
        if (err) return response.status(400).json({ error: 'User already exists' });
        response.json({ message: 'Registration successful' });
    });
};

exports.login = (request, response) => 
{
    const { email, password } = request.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => 
        {
            if (err || !user) 
                return response.status(400).json({ error: 'Invalid credentials' });
            if (!bcrypt.compareSync(password, user.password))
                return response.status(400).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
            response.cookie('token', token, { httpOnly: true, maxAge: 30 * 60 * 1000 });
            response.json({ message: 'Login successful', token });
        }
    );
};

exports.logout = (request, response) => 
{
    response.clearCookie('token');
    response.json({ message: 'Logged out successfully' });
};
