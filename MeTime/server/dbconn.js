const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://p21013206:p21013206@cluster0.2f0vhnp.mongodb.net/MeTime', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw error; // Propagate the error
    }
};

module.exports = connectDB;



