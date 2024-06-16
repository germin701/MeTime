const mongoose = require('mongoose');

const db = 'mongodb+srv://p21013206:p21013206@cluster0.2f0vhnp.mongodb.net/MeTime';

// Connect to the database
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.error("Can't connect to database", error);
    });

// Define a schema for the user collection
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String
}, { collection: 'user' });

// Create a model for the user collection
const User = mongoose.model('User', userSchema);

// Fetch data from the user collection
const fetchData = async () => {
    try {
        const users = await User.find({}, '_id name').exec();
        console.log('Users:', users);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Wait for the connection to be established before fetching data
mongoose.connection.once('open', fetchData);

