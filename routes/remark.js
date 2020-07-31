const express = require('express')

const Remark = require('../models/remark')
const authToken = require('../middlewares/authToken')

const router = express.Router()

router.get('/', async (req, res) => {
    const remarks = await Remark.find()
    res.json({ status: 200, remarks })
})



router.post('/',  async (req, res) => {
    const { complaintId ,remark } = req.body
    if (!remark)
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'remark is required!'
        })
    
    try {
        const Remarks = await Remark.create({
            complaintId: req.body.complaintId,
            remark: req.body.remark
        })
        res.status(201).json({
            status: 201,
            success: true,
            message: 'Added Successfully!',
            Remarks
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