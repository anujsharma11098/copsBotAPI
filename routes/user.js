if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const router = express.Router()

const User = require('../models/user')

router.get('/', async (req, res) => {
    const users = await User.find()
    res.json({ status: 200, users })
})

router.post('/register', async (req, res) => {
    const { name, phoneNumber, IMEI, latitude, longitude, password } = req.body
    try {
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)
        const user = await User.create({
            name, phoneNumber, IMEI, latitude, longitude, password: hash
        })
        const accessToken = jwt.sign({
            data: JSON.stringify(user)
        }, process.env.JWT_SECRET)
        res.status(201).json({ status: 201, token: accessToken })
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: 500, error: err })
    }
})

router.post('/login', async (req, res) => {
    const { phoneNumber, password } = req.body
    const user = await User.findOne({ phoneNumber })
    if (!user) return res.status(404).send('User not Found')
    const result = await bcrypt.compare(password, user.password)
    if (!result) return res.status(400).send('Incorrect Password')
    const accessToken = jwt.sign({
        data: JSON.stringify(user)
    }, process.env.JWT_SECRET)
    res.json({ status:200, token: accessToken })
})

module.exports = router