const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./schema/user.js');
const SavedGame = require('./schema/game.js');
const connectDB = require("./dbconn.js");
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(bodyParser.json());
app.use(cors());  // Enable CORS

dotenv.config(); 
// temporary storage to store OTP
const otps = new Map();
// connect to MongoDB
connectDB().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// route to handle user registration
app.post('/api/signup', async (req, res) => {
    try {
        const { email, username, password, confirmPassword } = req.body;

        // check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        // check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        // hash the password while storing in database
        const hashedPassword = await bcrypt.hash(password, 10);

        // generate a new UUID ( user ID) for each user using crypto 
        const id = crypto.randomBytes(16).toString('hex');

        // create a new user
        const newUser = new User({ _id: id, email, username, password: hashedPassword });

        // save the user to the database
        await newUser.save();

        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Failed to register user:', error);
        res.status(500).send('Failed to register user');
    }
});

// route to handle user login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        // check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        // generate a token once logged in successfully
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '24h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Failed to log in:', error);
        res.status(500).send('Failed to log in');
    }
});

// endpoint to get the username by email
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

// endpoint to get the user ID by email
app.get('/api/getUserId', async (req, res) => {
    const email = req.query.email;
  
    try {
      const user = await User.findOne({ email });
      if (user) {
        res.json({ userId: user._id });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// route to handle saving of a game to the user's favorites
app.post('/api/saveGame', async (req, res) => {
    try {
      const { username, game } = req.body; // extract game from req.body
  
      if (!username || !game) {
        return res.status(400).send('Invalid request body');
      }
  
      // check if the game is already saved by the user
      const existingSavedGame = await SavedGame.findOne({ username, id: game.id });
      if (existingSavedGame) {
        return res.status(400).send('Game already saved to favorites');
      }
  
      // create a new saved game
      const newSavedGame = new SavedGame({
        username,
        id: game.id,
        title: game.title,
        genre: game.genre,
        platform: game.platform,
        publisher: game.publisher,
        developer: game.developer,
        release_date: game.release_date,
        thumbnail: game.thumbnail,
        short_description: game.short_description,
        game_url: game.game_url,
      });
  
      // save the game to the database
      await newSavedGame.save();
  
      res.status(201).send('Game saved to favorites successfully');
    } catch (error) {
      console.error('Failed to save game:', error.message); // Log the error message
      res.status(500).send('Failed to save game');
    }
  });
  
// route to get saved games for a user
app.get('/api/saveGame', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).send('Username is required');
    }

    const savedGames = await SavedGame.find({ username });

    res.status(200).json(savedGames);
  } catch (error) {
    console.error('Failed to fetch saved games:', error.message); 
    res.status(500).send('Failed to fetch saved games');
  }
});

// route to handle deleting a saved game from the user's favorites
app.delete('/api/saveGame', async (req, res) => {
  try {
    const { username, gameId } = req.query;

    if (!username || !gameId) {
      return res.status(400).send('Username and gameId are required');
    }

    // find the game using username followed by game ID
    const result = await SavedGame.findOneAndDelete({ username, id: parseInt(gameId) });

    if (!result) {
      return res.status(404).send('Game not found');
    }

    res.status(200).send('Game deleted successfully');
  } catch (error) {
    console.error('Failed to delete game:', error.message); 
    res.status(500).send('Failed to delete game');
  }
});

// route to handle updating user details
// endpoint to handle updating user details
app.put('/api/updateUser/:username', async (req, res) => {
  try {
      const { username } = req.params;
      const { email, password } = req.body;
      
      // Find the user by their username
      // find the user by their username
      const user = await User.findOne({ username });

      if (!user) {
          return res.status(404).send('User not found');
      }

      // Update email if it is provided
      // update email if it is provided
      if (email) {
          user.email = email;
      }

      // Update password if it is provided
      // update password if it is provided
      if (password) {
          user.password = await bcrypt.hash(password, 10);
      }

      // Save the updated user details
      // save the updated user details
      await user.save();

      res.status(200).json({ email: user.email });
  } catch (error) {
      console.error('Failed to update user:', error);
      res.status(500).send('Failed to update user');
  }
});

const transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USERNAME, // from .env
    pass: process.env.EMAIL_PASSWORD
  },
});


// generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// send OTP for sign up
app.post('/api/sendOTPtoRegister', async (req, res) => {
  const { email } = req.body;

  try {
    // check whether user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // generate OTP
    const otp = generateOTP();
    // get the time when OTP is sent
    const createdAt = Date.now();

    otps.set(email, { otp, createdAt });

    //console.log(`Generated OTP for ${email}: ${otp}`);

    // construct email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Your Registration OTP',
      text: `Your OTP for registration is: ${otp}. This OTP is valid for 2 minutes.`
    };

    // send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
});

// verify OTP for sign up
app.post('/api/verifyOTPtoRegister', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOtp = otps.get(email);

    if (!storedOtp) {
      return res.status(400).json({ message: 'Invalid OTP data' });
    }

    // check for OTP expiration
    const { otp: storedOtpValue, createdAt } = storedOtp;
    const currentTime = Date.now();
    const elapsedTime = (currentTime - createdAt) / 1000;

    if (elapsedTime > 120) {
      otps.delete(email);
      return res.status(400).json({ message: 'OTP expired' });
    }

    // compare the generated and submitted OTP for validation
    const storedOtpString = String(storedOtpValue);
    const submittedOTPString = String(otp);

    if (storedOtpString.trim() !== submittedOTPString.trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    otps.delete(email);
    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ message: 'Failed to verify OTP.' });
  }
});

// current port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
