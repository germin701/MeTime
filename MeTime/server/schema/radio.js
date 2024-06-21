const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedRadioSchema = new Schema({
    username: {
        type: String,
        required: true,
    },

    stationuuid: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: false,
    },

    favicon: {
        type: String,
        required: false,
    },
    
    country: {
        type: String,
        required: false,
    },

    state: {
        type: String,
        required: false,
    },

    language: {
        type: String,
        required: false,
    },

    url_resolved: {
        type: String,
        required: false,
    },

    homepage: {
        type: String,
        required: false,
    }
}, {
    collection: 'saved_radios'  
});

const SavedRadio = mongoose.model('SavedRadio', SavedRadioSchema);
module.exports = SavedRadio;
