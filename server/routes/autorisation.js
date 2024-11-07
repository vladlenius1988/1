const { connectToServer, getDb } = require("../db/conn");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');
const bodyParser = require('body-parser');


const app = express();

require('dotenv').config();



app.use(bodyParser.json()); // Для парсингу JSON-запитів

// Роут для авторизації
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const token = await performLogin(username, password);
    if (!token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

const performLogin = async (username, password) => {
    try {
    
      await new Promise((resolve, reject) => connectToServer((err) => {
        if (err) reject(err);
        else resolve();
      }));
      
      const db = getDb();
      const usersCollection = db.collection('users');
  
      
      const user = await usersCollection.findOne({ username });
      if (!user) {
        console.log('User not found');
        return null;
      }
  
      console.log(`User found: ${JSON.stringify(user)}`);
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password does not match');
        return null;
      }
  
      const token = jwt.sign({ userId: user._id.toString(), role: user.role.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
      console.log('Login successful, token:', token);
      return token;
    } catch (err) {
      console.error('Error during login:', err.message);
      return null;
    }
  };



module.exports = app;
