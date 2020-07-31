const mongoose = require('mongoose')

const SosSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model('SOS', SosSchema)