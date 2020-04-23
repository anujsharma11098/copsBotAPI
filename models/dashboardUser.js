const mongoose = require('mongoose')

const DashboardUserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    region: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('DashboardUser', DashboardUserSchema)