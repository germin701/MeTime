const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./schema/user.js');
const connectDB = require("./dbconn.js");
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());  // Enable CORS

// Connect to MongoDB
connectDB().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// Route to handle user registration
app.post('/api/signup', async (req, res) => {
    try {
        const { email, username, password, confirmPassword } = req.body;

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a new UUID for each user
        const id = crypto.randomBytes(16).toString('hex');

        // Create a new user
        const newUser = new User({ _id: id, email, username, password: hashedPassword });

        // Save the user to the database
        await newUser.save();

        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Failed to register user:', error);
        res.status(500).send('Failed to register user');
    }
});

// Route to handle user login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        // Generate a token (optional)
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '24h' });

       // setTimeout(() => {
       //   res.status(401).send('Session expired. Please log in again.');
    //  }, 86400000); 


        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Failed to log in:', error);
        res.status(500).send('Failed to log in');
    }
});

// Endpoint to get the username by email
app.get('/api/getUsername', async (req, res) => {
  const email = req.query.email;

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({ username: user.username });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
