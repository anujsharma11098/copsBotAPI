const mongoose = require('mongoose')

const RemarkSchema = new mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    remark: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Remark', RemarkSchema)