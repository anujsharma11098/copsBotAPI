if (process.env.NODE_ENV != 'production') require('dotenv').config()

const express = require('express')
const twilio = require('twilio')
const fetch = require('node-fetch')

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const port = process.env.PORT

const router = express.Router()

const twilioClient = twilio(accountSid, authToken)

router.post('/', async (req, res) => {
    const { complaintId } = req.body
    if (!complaintId) return res.status(400).json({ status: 400, message: `'complaintId' is required` })
    let complaint
    try {
        let fetchedComplaint = await fetch(`http://localhost:${port}/api/complaints/${complaintId}`, {
            headers: {
                Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1wiX2lkXCI6XCI1ZWExN2YxZTU3N2VlNzE2ZmNjZGI0NGFcIixcInVzZXJuYW1lXCI6XCJzdXBlcmFkbWluXCIsXCJwYXNzd29yZFwiOlwiJDJhJDEwJGk1b3pwUkhlOS9mc2pYQjg4dlA0QWVaM1lBTUVSa0VkcGFqS1ozckNJSks1ZHAxUFhvM29xXCIsXCJyZWdpb25cIjpcIkdMT0JBTFwiLFwicm9sZVwiOlwic3VwZXJhZG1pblwiLFwiY3JlYXRlZEF0XCI6XCIyMDIwLTA0LTIzVDExOjQyOjIyLjA4OVpcIixcInVwZGF0ZWRBdFwiOlwiMjAyMC0wNC0yM1QxMTo0MjoyMi4wODlaXCIsXCJfX3ZcIjowfSIsImlhdCI6MTU4ODA4MjY5NX0.uHhP4pNAXat-VxOgvOKZ1dPopITwseJ8gwYyMGxVDWI'
            }
        })
        fetchedComplaint = await fetchedComplaint.json()
        if (fetchedComplaint.status !== 200) return res.status(404).json({ status: fetchedComplaint.status, message: fetchedComplaint.message })
        complaint = fetchedComplaint.complaint
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: 500, message: `Something Went Wrong!` })
    }

    let dateTime = complaint.createdAt.split('T')
    await twilioClient.messages.create({
        from: `whatsapp:+14155238886`,
        body: `Hey, Your complaint has been registered.\n\n\nHere are your details:\n\n👤Name - ${complaint.victimName}\n\nAge: ${complaint.age}\n\nGender: ${complaint.gender}\n\n📄Complaint: ${complaint.complaint}\n\n☎Contact No. ${complaint.userInfo[0].phoneNumber}\n\nDate of Incident: ${complaint.dateTime[0]}\n\n⏳Time of Incident: ${complaint.dateTime[1]}\n\n\nTo Navigate using Google Maps Please use this link - http://maps.google.com/maps?q=${complaint.iLatitude},${complaint.iLongitude}`,
        to: `whatsapp:+917726062540`
    })
    res.status(200).json({ status: 200, message: `Message Sent` })
})

module.exports = router