const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

const Complaint = require('../models/complaint')
const FakeComplaint = require('../models/fakeComplaint')
const SolvedComplaint = require('../models/solvedComplaint')
const authToken = require('../middlewares/authToken')
const { getRegion } = require('../util')
const authAdmin = require('../middlewares/authAdmin')
const authSuperAdmin = require('../middlewares/authSuperAdmin')

router.get('/:id', authToken, async (req, res) => {
    let complaints
    let complaint
    try {
        
            complaints = await Complaint.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(req.params.id)
                    }
                },
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
    } catch (err) {
        return res.status(404).json({ status: 404, message: 'Invalid Id' })
    }
    complaint = complaints[0]
    if (!complaint)
        return res.status(404).json({ status: 404, message: 'Not Found' })
    res.json({ status: 200, complaints })
})

module.exports = router