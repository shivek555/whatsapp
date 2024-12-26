const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' directory

// create database.json if it doesn't exist
if (!fs.existsSync('database.json')) {
  fs.writeFileSync('database.json', '{}');
}

// API endpoints
app.post('/login', (req, res) => {
  const { phone, password } = req.body;
  const database = JSON.parse(fs.readFileSync('database.json', 'utf8'));
  if (database[phone] && database[phone].password === password) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/register', (req, res) => {
  const { phone, password, fullName, email, birthDate, about } = req.body;
  const database = JSON.parse(fs.readFileSync('database.json', 'utf8'));
  
  if (database[phone]) {
    res.json({ success: false, message: 'Phone number already registered' });
  } else {
    database[phone] = {
      password,
      fullName,
      email,
      birthDate,
      about,
      registeredOn: new Date().toISOString()
    };
    fs.writeFileSync('database.json', JSON.stringify(database, null, 2));
    res.json({ success: true });
  }
});

// serve pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// start server
const port = 12345;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});