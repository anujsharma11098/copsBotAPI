const mongoose = require('mongoose')

const VoiceNoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    voiceNote: {
        type: String,
        required: true
    },
    iLatitude: {
        type: Number,
        required: true
    },
    iLongitude: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('VoiceNote', VoiceNoteSchema)