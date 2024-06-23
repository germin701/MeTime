const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedNewsSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    article_id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: false,
    },
    link: {
        type: String,
        required: false,
    },
    creator: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    pubDate: {
        type: String,
        required: false,
    },
    image_url: {
        type: String,
        required: false,
    },
    source_id: {
        type: String,
        required: false,
    },
    language: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    }
}, {
    collection: 'saved_news'  
});

const SavedNews = mongoose.model('SavedNews', SavedNewsSchema);
module.exports = SavedNews;
