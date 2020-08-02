const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.json({ status: 200, message: 'Server Up and Running...' })
})

router.use('/api/users', require('./user'))
router.use('/api/complaints', require('./complaint'))
router.use('/api/regions', require('./region'))
router.use('/api/dashboard', require('./dashboard'))
router.use('/api/whatsapp', require('./whatsapp'))
router.use('/api/incident', require('./incident'))
router.use('/api/voiceNote', require('./voiceNote'))
router.use('/api/alert', require('./alert'))
router.use('/api/status', require('./status'))
router.use('/api/remark', require('./remark'))
router.use('/api/sos', require('./sos'))
router.use('/api/charts', require('./chart'))


module.exports = router