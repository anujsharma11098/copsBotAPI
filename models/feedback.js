const mongoose = require('mongoose')

const FeedbackSchema = new mongoose.Schema({
    rating: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Feedback', FeedbackSchema)