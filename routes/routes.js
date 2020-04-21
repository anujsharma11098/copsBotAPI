const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.json({ status: 200, message: 'Server Up and Running...' })
})

router.use('/api/users', require('./user'))
router.use('/api/complaints', require('./complaint'))
router.use('/api/regions', require('./region'))
router.use('/api/dashboard', require('./dashboard'))

module.exports = router