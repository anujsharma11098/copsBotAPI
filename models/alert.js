const mongoose = require('mongoose')

const AlertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    alertMsg: {
        type: String,
        required: true
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Alert', AlertSchema)