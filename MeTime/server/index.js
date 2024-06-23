const express = require('express');
const bodyParser = require('body-parser');
const User = require('./schema/user.js');
const SavedGame = require('./schema/game.js');
const SavedBook = require('./schema/book.js');
const SavedRadio = require('./schema/radio.js');
const SavedNews = require('./schema/news.js');
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

// check if email or username exists
app.post('/api/checkUserExistence', async (req, res) => {
  try {
      const { email, username } = req.body;

      // check if email exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
          return res.status(400).json({ message: 'Email already exists' });
      }

      // check if username exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
          return res.status(400).json({ message: 'Username already exists' });
      }

      res.status(200).json({ message: 'Email and username are available' });
  } catch (error) {
      console.error('Failed to check user existence:', error);
      res.status(500).json({ message: 'Failed to check user existence' });
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

// route to handle saving of a book to the user's favorites
app.post('/api/saveBook', async (req, res) => {
  try {
    const { username, book } = req.body; // extract book from req.body

    if (!username || !book) {
      return res.status(400).send('Invalid request body');
    }

    // check if the book is already saved by the user
    const existingSavedBook = await SavedBook.findOne({ username, id: book.id });
    if (existingSavedBook) {
      return res.status(400).send('Book already saved to favorites');
    }

    // create a new saved book
    const newSavedBook = new SavedBook({
      username,
      id: book.id,
      title: book.title,
      first_sentence: book.first_sentence,
      author: book.author,
      cover_id: book.cover_id,
      edition_count: book.edition_count,
      first_publish_year: book.first_publish_year,
      publisher: book.publisher,
      language: book.language,
      time: book.time,
      ratings_average: book.ratings_average,
    });

    // save the book to the database
    await newSavedBook.save();

    res.status(201).send('Book saved to favorites successfully');
  } catch (error) {
    console.error('Failed to save book:', error.message); // Log the error message
    res.status(500).send('Failed to save book');
  }
});

// route to get saved books for a user
app.get('/api/saveBook', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).send('Username is required');
    }

    const savedBooks = await SavedBook.find({ username });

    res.status(200).json(savedBooks);
  } catch (error) {
    console.error('Failed to fetch saved books:', error.message);
    res.status(500).send('Failed to fetch saved books');
  }
});

// route to handle deleting a saved book from the user's favorites
app.delete('/api/saveBook', async (req, res) => {
  try {
    const { username, bookId } = req.query;

    if (!username || !bookId) {
      return res.status(400).send('Username and bookId are required');
    }

    // find the book using username followed by book ID
    const result = await SavedBook.findOneAndDelete({ username, id: bookId });

    if (!result) {
      return res.status(404).send('Book not found');
    }

    res.status(200).send('Book deleted successfully');
  } catch (error) {
    console.error('Failed to delete book:', error.message);
    res.status(500).send('Failed to delete book');
  }
});

// route to handle saving of a radio to the user's favorites
app.post('/api/saveRadio', async (req, res) => {
  try {
    const { username, station } = req.body;

    if (!username || !station) {
      return res.status(400).send('Invalid request body');
    }

    // check if the radio is already saved by the user
    const existingSavedRadio = await SavedRadio.findOne({ username, id: station.stationuuid });
    if (existingSavedRadio) {
      return res.status(400).send('Radio already saved to favorites');
    }

    // create a new saved radio
    const newSavedRadio = new SavedRadio({
      username,
      stationuuid: station.stationuuid,
      name: station.name,
      favicon: station.favicon,
      country: station.country,
      state: station.state,
      language: station.language,
      url_resolved: station.url_resolved,
      homepage: station.homepage,
    });

    // save the radio to the database
    await newSavedRadio.save();

    res.status(201).send('Radio saved to favorites successfully');
  } catch (error) {
    console.error('Failed to save radio:', error.message);
    res.status(500).send('Failed to save radio');
  }
});

// route to get saved radios for a user
app.get('/api/saveRadio', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).send('Username is required');
    }

    const savedRadios = await SavedRadio.find({ username });

    res.status(200).json(savedRadios);
  } catch (error) {
    console.error('Failed to fetch saved radios:', error.message);
    res.status(500).send('Failed to fetch saved radios');
  }
});

// route to handle deleting a saved radio from the user's favorites
app.delete('/api/saveRadio', async (req, res) => {
  try {
    const { username, radioId } = req.query;

    if (!username || !radioId) {
      return res.status(400).send('Username and radioId are required');
    }

    // find the radio using username followed by radio ID
    const result = await SavedRadio.findOneAndDelete({ username, stationuuid: radioId });

    if (!result) {
      return res.status(404).send('Radio not found');
    }

    res.status(200).send('Radio deleted successfully');
  } catch (error) {
    console.error('Failed to delete radio:', error.message);
    res.status(500).send('Failed to delete radio');
  }
});


// route to handle saving of a news to the user's favorites
app.post('/api/saveNews', async (req, res) => {
  try {
    const { username, article } = req.body;

    // Log the incoming request body
    console.log('Incoming save news request:', req.body);
    console.log(article.article_id);

    if (!username || !article || !article.article_id) {
      return res.status(400).send('Invalid request body');
    }

    // check if the news is already saved by the user
    const existingSavedNews = await SavedNews.findOne({ username, article_id: article.article_id });
    if (existingSavedNews) {
      return res.status(400).send('News already saved to favorites');
    }

    // create a new saved news
    const newSavedNews = new SavedNews({
      username,
      article_id: article.article_id,
      title: article.title,
      link: article.link,
      creator: article.creator, 
      description: article.description,
      pubDate: article.pubDate,
      image_url: article.image_url,
      source_id: article.source_id,
      language: article.language,
      country: article.country, 
      category: article.category, 
        
    });

    // save the news to the database
    await newSavedNews.save();

    res.status(201).send('News saved to favorites successfully');
  } catch (error) {
    console.error('Failed to save news:', error.message);
    res.status(500).send('Failed to save news');
  }
});

// route to get saved news for a user
app.get('/api/saveNews', async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).send('Username is required');
    }

    const savedNews = await SavedNews.find({ username });

    res.status(200).json(savedNews);
  } catch (error) {
    console.error('Failed to fetch saved news:', error.message);
    res.status(500).send('Failed to fetch saved news');
  }
});

// route to handle deleting a saved news from the user's favorites
app.delete('/api/saveNews', async (req, res) => {
  try {
    const { username, newsId } = req.query;

    if (!username || !newsId) {
      return res.status(400).send('Username and newsId are required');
    }

    // find the radio using username followed by article ID
    const result = await SavedNews.findOneAndDelete({ username, article_id: newsId });

    if (!result) {
      return res.status(404).send('News not found');
    }

    res.status(200).send('News deleted successfully');
  } catch (error) {
    console.error('Failed to delete news:', error.message);
    res.status(500).send('Failed to delete news');
  }
});



// route to handle updating user details
app.put('/api/updateUser/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { email, password } = req.body;

    // Find the user by their username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update email if it is provided
    if (email) {
      user.email = email;
    }

    // Update password if it is provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Save the updated user details
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

const saltRounds = 10;

// route to send OTP to user's email for reset password
app.post('/api/sendOTP', async (req, res) => {
  const { email } = req.body;

  try {
    // find for user
    console.log(`Received OTP request for email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //console.log('User found:', user);

    // generate OTP
    const otp = generateOTP().toString();
    const otpExpiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes from now

    // hash the OTP to store in database
    const hashedOtp = await bcrypt.hash(otp, saltRounds);
    //console.log(`Generated OTP: ${otp}, Hashed OTP: ${hashedOtp}`);

    // save the hashed OTP
    user.otp = hashedOtp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();
    console.log('OTP and expiration time saved to user document.');

    // construct email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Me Time Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 2 minutes.`
    };

    // send email
    await transporter.sendMail(mailOptions);
    console.log('OTP sent via email.');

    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP.' });
  }
});


// endpoint to verify OTP
app.post('/api/verifyOTP', async (req, res) => {
  const { email, submittedOTP } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // get current time 
    const currentTime = Date.now();
    //console.log(`Current Time: ${currentTime}, OTP Expires At: ${user.otpExpiresAt}`);

    // check for OTP expiration
    if (currentTime > user.otpExpiresAt) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // if is not expired, compare the string entered
    const isOtpValid = await bcrypt.compare(submittedOTP, user.otp);
    console.log(`OTP Valid: ${isOtpValid}`);

    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // clear the OTP and its expiration time in database after successful verification
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// route to handle updating password reset
app.put('/api/resetPassword/:email', async (req, res) => {
  const { email } = req.params;
  const { password } = req.body;

  try {
    // find the user by their username
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // update password and hash it
    user.password = await bcrypt.hash(password, 10);

    // save the updated password
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Failed to update user password:', error);
    res.status(500).send('Failed to update user password');
  }
});

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
      subject: 'Me Time: Your Registration OTP',
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
