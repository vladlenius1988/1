const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();


app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'User' }
});
const User = mongoose.model('User', userSchema);

// Підключення до MongoDB
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/register', async (req, res) => {
  
  const { username, password, email } = req.body;

  // Перевірка наявності всіх потрібних полів
  if (!username || !password || !email ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Логування отриманих даних
  console.log('Received data:', req.body);

  try {
    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, email, role: 'User' });
    console.log(newUser)
    await newUser.save(); // Використовуємо await для обробки проміса
    res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = app;
