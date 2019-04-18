const mongoose = require('mongoose');

let snippetSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        required: true,
        type: String,
        trim: true
    },
    language: {
        required: true,
        type: String,
        trim: true
    }
});

let Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = {Snippet};