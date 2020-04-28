if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}
const express = require('express')
const twilio = require('twilio')
const fetch = require('node-fetch')



const router = express.Router()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const port = process.env.PORT || 3000

const twilioClient = twilio(accountSid, authToken)

router.post('/', async (req, res) => {
    const { complaintId, region } = req.body
    if (complaintId == '' || complaintId == null) return res.status(400).json({ status: 400, message: `'complaintId' is required` })
    
    let complaint
    try {
        let fetchedComplaint = await fetch(`http://localhost:${port}/api/complaints/${complaintId}`)
        fetchedComplaint = await fetchedComplaint.json()
        if (fetchedComplaint.status == 404) return res.status(404).json({ status: fetchedComplaint.status, message: fetchedComplaint.message })
        complaint = fetchedComplaint.complaint
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: 500, message: `Internal Server Error` })
    }
    
    
        twilioClient.messages.create({
            from: `whatsapp:+14155238886`,
            body: `Hey, Your complaint has been registered.\n\n\nHere are your details:\n\n👤Name - ${complaint.victimName}\n\nAge: ${complaint.age}\n\nGender: ${complaint.gender}\n\n📄Complaint: ${complaint.complaint}\n\n☎Contact No. ${complaint.phoneNumber}\n\nDate of Incident: ${complaint.dateOfIncident}\n\n⏳Time of Incident: ${complaint.timeOfIncident}\n\n\nTo Navigate using Google Maps Please use this link - http://maps.google.com/maps?q=${complaint.iLatitude},${ complaint.iLongitude }`,
            to: `whatsapp:+917726062540`
        })
    })
    res.status(200).json({ status: 200, message: `Message Sent` })


module.exports = router