if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const router = express.Router()

const User = require('../models/user')
const authAdmin = require('../middlewares/authAdmin')

router.get('/', authAdmin, async (req, res) => {
    const users = await User.find()
    res.json({ status: 200, users })
})

router.post('/register', async (req, res) => {
    const { name, email,phoneNumber, IMEI, latitude, longitude, password } = req.body
    try {
        const salt = await bcrypt.genSalt()
        const hash = await bcrypt.hash(password, salt)
        const user = await User.create({
            name, phoneNumber,email, IMEI, latitude, longitude, password: hash
        })
        const accessToken = jwt.sign({
            data: JSON.stringify(user)
        }, process.env.JWT_SECRET)
        res.status(201).json({ status: 201, token: accessToken })
    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ status: 400, message: 'User already Exists!' })
        console.log(err)
        res.status(500).json({ status: 500, message: 'Internal Server Error', error: err })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).send('User not Found')
    const result = await bcrypt.compare(password, user.password)
    if (!result) return res.status(400).send('Incorrect Password')
    const accessToken = jwt.sign({
        data: JSON.stringify(user)
    }, process.env.JWT_SECRET)
    res.json({ status: 200, token: accessToken ,userId: user._id })
})

module.exports = router