const express = require('express')

const Incident = require('../models/incident')
const authToken = require('../middlewares/authToken')

const router = express.Router()

router.get('/', async (req, res) => {
    const incidents = await Incident.find()
    res.json({ status: 200, incidents })
})

router.get('/:id', async (req, res) => {
    try {
        const incidents = await Incident.findOne({ _id: req.params.id })
        res.json({ status: 200, incidents })
    } catch (err) {
        res.status(400).json({ status: 400, message: 'Invalid Object Id!' })
    }
})

router.post('/', authToken, async (req, res) => {
    const { incidentDesc, iLatitude, iLongitude, evidence } = req.body
    if (!incidentDesc)
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'incidentDesc is required!'
        })
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
    if (!evidence)
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'evidence is required!'
        })
    try {
        const incident = await Incident.create({
            userId: req.user._id,
            incidentDesc,
            iLatitude,
            iLongitude,
            evidence
        })
        res.status(201).json({
            status: 201,
            success: true,
            message: 'Added Successfully!',
            incident
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