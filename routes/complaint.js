const express = require('express')

const router = express.Router()

const Complaint = require('../models/complaint')
const authToken = require('../middlewares/authToken')

router.get('/', async (req, res) => {
    const complaints = await Complaint.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userInfo'
            }
        }, {
            $sort: {
                createdAt: -1
            }
        }
    ])
    res.json({ status: 200, complaints })
})

router.post('/', authToken, async (req, res) => {
    const { victimName, complaint, age, gender, iLatitude, iLongitude } = req.body
    try {
        await Complaint.create({
            userId: req.user._id, victimName, complaint, age, gender, iLatitude, iLongitude, status: 0
        })
        res.status(201).send('Complaint Registered Successfully')
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, error: err })
    }
})

module.exports = router