const express = require('express')

const VoiceNote = require('../models/voiceNote')
const authToken = require('../middlewares/authToken')

const router = express.Router()

router.get('/', async (req, res) => {
    const voiceNotes = await VoiceNote.find()
    res.json({ status: 200, voiceNotes })
})

router.get('/:id', async (req, res) => {
    try {
        const voiceNotes = await VoiceNote.findOne({ _id: req.params.id })
        res.json({ status: 200, voiceNotes })
    } catch (err) {
        res.status(400).json({ status: 400, message: 'Invalid Object Id!' })
    }
})

router.post('/', authToken, async (req, res) => {
    const { iLatitude, iLongitude, voiceNote } = req.body
    if (!iLatitude)
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'iLatitude is required!'
        })
    if (!iLongitude)
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'iLongitude is required!'
        })
    if (!voiceNote)
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'voiceNote is required!'
        })
    try {
        const voiceNotes = await VoiceNote.create({
            userId: req.user._id,
            iLatitude,
            iLongitude,
            voiceNote: voiceNotes.includes('?alt=media') ? voiceNotes : voiceNotes + '?alt=media'
        })
        res.status(201).json({
            status: 201,
            success: true,
            message: 'Added Successfully!',
            voiceNote
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Something Went Wrong!'
        })
    }
})

module.exports = router