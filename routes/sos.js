const express = require('express')

const SOS = require('../models/sos')
const authToken = require('../middlewares/authToken')

const router = express.Router()

router.get('/', async (req, res) => {
    const sos = await SOS.find()
    res.json({ status: 200, sos })
})



router.post('/',authToken,  async (req, res) => {
    const { iLatitude,iLongitude } = req.body
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
    
    try {
        const sos = await SOS.create({
            userId: req.user._id,
            iLatitude,
            iLongitude
        })
        res.status(201).json({
            status: 201,
            success: true,
            message: 'Added Successfully!',
            sos
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