const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require("cors");
const app = express();
app.use(cors({
    origin: 'http://localhost:3000', 
}));
require('dotenv').config();


app.use(bodyParser.json());
console.log('Telegram bot server started!');

const jwt = require('jsonwebtoken'); 

app.use((req, res, next) => {
    console.log('Authorization Header:', req.headers['authorization']); // Логування заголовка
    next();
});


function authenticateToken(roles = []) {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        console.log(token);
        if (!token) return res.status(401).json({ message: 'No token' });

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

            const userRole = user.role; 
            if (roles.length && !roles.includes(userRole)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            req.user = user; // Додаємо інформацію про користувача до запиту
            next();
        });
    };
}

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`); // Логуємо метод та URL запиту
    next(); // Передаємо управління далі
  });



app.post('/order', authenticateToken(['User']), async (req, res) => {
    const { userId, userRole,  cart, totalPrice } = req.body;
    
    
  
  console.log('Замовлення:', req.body);

 


  const message = `
    🛒 *Замовлення*:
    - *Користувач ID*: ${userId}
    - *Товари*: 
    ${cart.map(item => `• ${item.name} (x${item.quantity}) - ${item.price * item.quantity} ₴`).join('\n')}
    - *Загальна сума*: ${totalPrice} ₴
  `;
  console.log('message body:', message);
  console.log('Sending to Telegram:', {
    chat_id: process.env.CHAT_ID,
    text: message,
    parse_mode: 'Markdown',
    
});

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    console.log('Request body:', req.body);
    const responseData = await telegramResponse.json();
  console.log('Response from Telegram API:', responseData); 
  
    res.status(200).json({ message: 'Order sent to Telegram!' });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    res.status(500).json({ message: 'Failed to send order.' });
  }
});

module.exports = app;