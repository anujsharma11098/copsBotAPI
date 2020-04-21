const mongoose = require('mongoose')

const FakeComplaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    victimName: {
        type: String,
        required: true
    },
    complaint: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
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
    },
    region: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    deletedAt: Date
}, {
    timestamps: true
})

module.exports = mongoose.model('FakeComplaint', FakeComplaintSchema)