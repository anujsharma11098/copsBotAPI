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

router.get('/', authAdmin, async (req, res) => {
    let complaints
    if (req.user.role == 'superadmin') {
        if (req.query.fake == 'true')
            complaints = await FakeComplaint.aggregate([
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
        else if (req.query.solved == 'true')
            complaints = await SolvedComplaint.aggregate([
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
        else
            complaints = await Complaint.aggregate([
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
    } else {
        if (req.query.fake == 'true')
            complaints = await FakeComplaint.aggregate([
                {
                    $match: {
                        region: req.user.region
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
        else if (req.query.solved == 'true')
            complaints = await SolvedComplaint.aggregate([
                {
                    $match: {
                        region: req.user.region
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
        else
            complaints = await Complaint.aggregate([
                {
                    $match: {
                        region: req.user.region
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
    }
    res.json({ status: 200, complaints })
})

router.get('/:id', authAdmin, async (req, res) => {
    let complaints
    let complaint
    try {
        if (req.query.fake == 'true')
            complaints = await FakeComplaint.aggregate([
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
        else if (req.query.solved == 'true')
            complaints = await SolvedComplaint.aggregate([
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
        else
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
    res.json({ status: 200, complaint })
})

router.post('/', authToken, async (req, res) => {
    console.log(req.body)
    res.json({ status: 200, message: 'Done' })
    // const { victimName, complaint, age, gender, iLatitude, iLongitude } = req.body
    // const region = getRegion(iLatitude, iLongitude)
    // try {
    //     await Complaint.create({
    //         userId: req.user._id, victimName, complaint, age, gender, iLatitude, iLongitude, region, status: 0
    //     })
    //     res.status(201).json({ status: 201, message: 'Complaint Registered Successfully!' })
    // } catch (err) {
    //     console.log(err)
    //     res.status(500).json({ status: 500, error: err })
    // }
})

router.checkout('/:id', authAdmin, async (req, res) => {
    if (!req.body.reason)
        return res.status(400).json({ status: 400, message: 'Reason is required' })
    let complaint
    try {
        complaint = await Complaint.findOne({ _id: req.params.id })
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed for value'))
            return res.status(404).json({ status: 404, message: 'Complaint not found' })
        console.log(err)
        res.status(500).json({ status: 500, message: 'Internal Server Error' })
    }
    if (!complaint)
        return res.status(404).json({ status: 404, message: 'Complaint not found' })
    if (complaint.status === 0) {
        complaint.status = 1
        complaint.changeStatusReason1 = req.body.reason
        complaint.save()
        res.json({ status: 200, id: req.params.id, statusBefore: 0 })
    } else if (complaint.status === 1) {
        complaint.status = 2
        complaint.changeStatusReason2 = req.body.reason
        await SolvedComplaint.create({
            _id: complaint._id,
            userId: complaint.userId,
            victimName: complaint.victimName,
            complaint: complaint.complaint,
            age: complaint.age,
            gender: complaint.gender,
            iLatitude: complaint.iLatitude,
            iLongitude: complaint.iLatitude,
            region: complaint.region,
            status: complaint.status,
            createdAt: complaint.createdAt,
            updatedAt: complaint.updatedAt,
            solvedAt: new Date
        })
        await complaint.remove()
        res.json({ status: 200, id: req.params.id, statusBefore: 1 })
    } else {
        res.status(500).json({ status: 500, message: 'Internal Server Error' })
    }
})

router.delete('/:id', authAdmin, async (req, res) => {
    if (!req.body.reason)
        return res.status(400).json({ status: 400, message: 'Reason is required' })
    try {
        const complaint = await Complaint.findOne({ _id: req.params.id })
        if (!complaint)
            return res.status(404).json({ status: 404, message: 'Complaint not found' })
        if (complaint.status === 1)
            return res.status(400).json({ status: 400, message: 'You cannot delete active complaint' })
        await FakeComplaint.create({
            _id: complaint._id,
            userId: complaint.userId,
            victimName: complaint.victimName,
            complaint: complaint.complaint,
            age: complaint.age,
            gender: complaint.gender,
            iLatitude: complaint.iLatitude,
            iLongitude: complaint.iLatitude,
            region: complaint.region,
            status: complaint.status,
            createdAt: complaint.createdAt,
            updatedAt: complaint.updatedAt,
            changeStatusReason1: complaint.changeStatusReason1,
            changeStatusReason2: complaint.changeStatusReason2,
            deleteReason: req.body.reason,
            deletedAt: new Date
        })
        await complaint.remove()
        res.json({ status: 200, message: 'Deleted Successfully' })
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed for value'))
            return res.status(404).json({ status: 404, message: 'Complaint not found' })
        console.log(err)
        res.status(500).json({ status: 500, message: 'Internal Server Error' })
    }
})

router.put('/:id', authSuperAdmin, async (req, res) => {
    try {
        const foundFakeComplaint = await FakeComplaint.findOne({ _id: req.params.id })
        if (!foundFakeComplaint)
            return res.status(404).json({ status: 404, message: 'Complaint not found' })
        await Complaint.create({
            _id: foundFakeComplaint._id,
            userId: foundFakeComplaint.userId,
            victimName: foundFakeComplaint.victimName,
            complaint: foundFakeComplaint.complaint,
            age: foundFakeComplaint.age,
            gender: foundFakeComplaint.gender,
            iLatitude: foundFakeComplaint.iLatitude,
            iLongitude: foundFakeComplaint.iLatitude,
            region: foundFakeComplaint.region,
            status: foundFakeComplaint.status,
            createdAt: foundFakeComplaint.createdAt,
            updatedAt: foundFakeComplaint.updatedAt,
            changeStatusReason1: foundFakeComplaint.changeStatusReason1,
            changeStatusReason2: foundFakeComplaint.changeStatusReason2,
            deleteReason: foundFakeComplaint.reason
        })
        await foundFakeComplaint.remove()
        res.json({ status: 200, message: 'Restored Successfully' })
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed for value'))
            return res.status(404).json({ status: 404, message: 'Complaint not found' })
        console.log(err)
        res.status(500).json({ status: 500, message: 'Internal Server Error' })
    }
})

module.exports = router