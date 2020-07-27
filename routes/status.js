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

router.get('/', async (req, res) => {
    let complaints
    let complaint
    try {
        
            complaints = await Complaint.aggregate([
                {
                    $match: {
                        userId: mongoose.Types.ObjectId(req.headers.id)
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
    
    if (!complaints)
        return res.status(404).json({ status: 404, message: 'Not Found' })
    res.json( complaints )
})

module.exports = router