const {Schema, model} = require('mongoose');

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    authors: {
        type: String,
        default: "",
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = model('Books', bookSchema);