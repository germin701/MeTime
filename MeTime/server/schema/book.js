const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedBookSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    first_sentence: {
        type: String,
        required: false,
    },
    author: {
        type: [String],
        required: true,
    },
    cover_id: {
        type: Number,
        required: false,
    },
    edition_count: {
        type: Number,
        required: false,
    },
    first_publish_year: {
        type: Number,
        required: false,
    },
    publisher: {
        type: String,
        required: false,
    },
    language: {
        type: [String],
        required: false,
    },
    time: {
        type: [String],
        required: false,
    },
    ratings_average: {
        type: Number,
        required: false,
    }
}, {
    collection: 'saved_books'
});

const SavedBook = mongoose.model('SavedBook', SavedBookSchema);
module.exports = SavedBook;
