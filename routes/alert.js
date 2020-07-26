const express = require('express')

const Alert = require('../models/alert')


const router = express.Router()

router.get('/', async (req, res) => {
    const Alerts = await Alert.find()
    res.json(Alerts)
})



router.post('/', async (req, res) => {
    const { title, alertMsg } = req.body
    try {
        await Alert.create({
             title, alertMsg
        })
        res.status(201).json({ status: 201, message: 'Alert Broadcasted Successfully!' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, error: err })
    }
})


module.exports = router