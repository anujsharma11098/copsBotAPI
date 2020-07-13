if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const DashboardUser = require('../models/dashboardUser')
const authSuperAdmin = require('../middlewares/authSuperAdmin')

const router = express.Router()

router.get('/users', authSuperAdmin, async (req, res) => {
    const users = await DashboardUser.find({ role: { $ne: 'superadmin' } })
    res.json({ status: 200, message: users })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
        return res.status(400).json({ status: 400, message: 'username and password is required' })
    const foundUser = await DashboardUser.findOne({ username })
    if (!foundUser)
        return res.status(404).json({ status: 404, message: 'User not found' })
    const isMatch = await bcrypt.compare(password, foundUser.password)
    if (!isMatch)
        return res.status(400).json({ status: 400, message: 'Password is Incorrect' })
    const accessToken = jwt.sign({
        data: JSON.stringify(foundUser)
    }, process.env.JWT_SECRET)
    res.json({ status: 200, message: 'Login Successfull', user: foundUser, token: accessToken })
})

router.post('/register', authSuperAdmin, async (req, res) => {
    const { username, password, region } = req.body
    if (!username || !password || !region)
        return res.status(400).json({ status: 400, message: 'username password and region is required' })
    const role = 'admin'
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    try {
        await DashboardUser.create({
            username,
            password: hash,
            region,
            role
        })
        res.status(201).json({ status: 201, message: 'Registered Successfully' })
    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ status: 400, message: 'User already exists' })
        console.log(err)
        res.status(500).json({ status: 500, message: 'Internal Server Error', error: err })
    }
})

module.exports = router

// Use this function to create super admin
// async function createSuperAdmin() {
//     try {
//         await DashboardUser.create({
//             username: 'superadmin',
//             password: await bcrypt.hash('password', 10),
//             region: 'all',
//             role: 'superadmin'
//         })
//         console.log('Created Super Admin!')
//     } catch (err) {
//         console.log(err)
//     }
// }

// createSuperAdmin()