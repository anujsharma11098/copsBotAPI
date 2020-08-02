const express = require('express')

const authSuperAdmin = require('../middlewares/authSuperAdmin')
const Complaint = require('../models/complaint')
const SolvedComplaint = require('../models/solvedComplaint')
const FakeComplaint = require('../models/fakeComplaint')

const router = express.Router()

router.get('/', authSuperAdmin, async (req, res) => {
    const complaints = await Complaint.find()
    const solvedComplaints = await SolvedComplaint.find()
    const fakeComplaints = await FakeComplaint.find()
    const allComplaints = [...complaints, ...solvedComplaints]
    const categoriesWiseComplaints = { 'Theft': [], 'Murder': [], 'Molestation': [], 'Domestic Violence': [], 'Cyber Crime': [], 'Hit and Run': [], 'Acid Attack': [], 'Sexual Harassment': [], 'Kidnapp': [], 'Rape': [], 'Other': [] }
    const status0Complaints = complaints.filter(c => c.status === 0)
    const status1Complaints = complaints.filter(c => c.status === 1)
    const status2Complaints = [...solvedComplaints]
    allComplaints.forEach(c => {
        try {
            categoriesWiseComplaints[c.crimeCategory].push(c)
        } catch (err) {
            console.log(err)
        }
    })
    res.json({ status: 200, status0Complaints, status1Complaints, status2Complaints, categoriesWiseComplaints, fakeComplaints })
})

module.exports = router