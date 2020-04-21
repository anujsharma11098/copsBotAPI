const express = require('express')

const router = express.Router()

const Complaint = require('../models/complaint')
const authToken = require('../middlewares/authToken')
const { getRegion } = require('../util')

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
    const region = getRegion(iLatitude, iLongitude)
    try {
        await Complaint.create({
            userId: req.user._id, victimName, complaint, age, gender, iLatitude, iLongitude, region, status: 0
        })
        res.status(201).json({ status: 201, message: 'Complaint Registered Successfully!' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, error: err })
    }
})

module.exports = router