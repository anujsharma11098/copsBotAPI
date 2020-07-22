const express = require('express')

const Incident = require('../models/incident')
const authToken = require('../middlewares/authToken')
const { bucket, uploader } = require('../util/imageUpload')

const router = express.Router()

router.get('/', async (req, res) => {
    const incidents = await Incident.find()
    res.json({ status: 200, incidents })
})

router.post('/', uploader.single('image'), authToken, async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    if (!req.file)
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'No File Provided!'
        })
    if (req.fileValidationError)
        return res.status(400).json({
            status: 400,
            success: false,
            message: req.fileValidationError
        })
    const { incidentDesc, iLatitude, iLongitude } = req.body
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
    try {
        const blob = bucket.file(req.file.originalname)

        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        })

        blobWriter.on('error', err => {
            console.log('\x1b[31m%s\x1b[0m', err)
            res.status(500).json({
                status: 500,
                success: false,
                message: 'Something Went Wrong!'
            })
        })

        blobWriter.on('finish', async () => {
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`
            const incident = await Incident.create({
                userId: req.user._id,
                incidentDesc,
                iLatitude,
                iLongitude,
                evidence: publicUrl
            })
            res.status(201).json({
                status: 201,
                success: true,
                message: 'Added Successfully!',
                incident
            })
        })

        blobWriter.end(req.file.buffer)
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