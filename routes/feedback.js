const express = require('express')

const Feedback = require('../models/feedback')


const router = express.Router()

router.get('/', async (req, res) => {
    const Feedbacks = await Feedback.find()
    res.json(Feedbacks)
})



router.post('/', async (req, res) => {
    const { rating, feedback } = req.body
    try {
        await Feedback.create({
             rating, feedback
        })
        res.status(201).json({ status: 201, message: 'Feedback Taken Successfully!' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, error: err })
    }
})


module.exports = router