const express = require('express')

const router = express.Router()

const { regions } = require('../util')

router.get('/', (req, res) => {
    res.json({ status: 200, message: 'List of all available regions', regions })
})

module.exports = router