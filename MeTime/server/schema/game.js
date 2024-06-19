const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedGameSchema = new Schema({
    username: {
        type: String,
        required: true,
    },

    id: {
        type: Number,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
    developer: {
        type: String,
        required: true,
    },
    release_date: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    short_description: {
        type: String,
        required: true,
    },
    game_url: {
        type: String,
        required: true,
    }
}, {
    collection: 'saved_games'  
});

const SavedGame = mongoose.model('SavedGame', SavedGameSchema);
module.exports = SavedGame;
