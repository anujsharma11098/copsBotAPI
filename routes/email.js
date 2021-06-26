const express = require('express')
const mongoose = require('mongoose')
const nodemailer = require("nodemailer");

const router = express.Router()



var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
port: 587,
ignoreTLS: false,
secure: false,
    auth: {
        user: 'keerti10042000@gmail.com',
        pass: '8890860023',
        },
    });

router.post('/', async (req, res) => {
    try {
        let { victimName ,email, complaint, crimeCategory, age, gender, iLatitude, iLongitude, landmark, dateOfIncident, timeOfIncident, status } = req.body
        
        mailOptions = {
            to: email,
            subject: "Your complaint has been registered", // Subject line
            html: `<table  border='1' style='border-collapse:collapse;padding:10px'>
                <tr>
                    <td><b>Name :</b></td>
                    <td>${victimName}</td>
                </tr>
                <tr>
                    <td><b>Complaint :</b></td>
                    <td>${complaint}</td>
                </tr>
                <tr>
                    <td><b>Crime Category</b></td>
                    <td>${crimeCategory}</td>
                </tr>
                <tr>
                    <td><b>Age :</b></td>
                    <td>${age}</td>
                </tr>
                <tr>
                    <td><b>Gender</b></td>
                    <td>${gender}</td>
                </tr>
                <tr>
                    <td><b>Landmar :</b></td>
                    <td>${landmark}</td>
                </tr>
                <tr>
                    <td><b>Date of Incident :</b></td>
                    <td>${dateOfIncident}</td>
                </tr>
                <tr>
                    <td><b>Time of Incident :</b></td>
                    <td>${timeOfIncident}</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>${status}</td>
                </tr>
          </table>`, // html body
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                console.log(error);
                } else {
                console.log("Email sent: " + info.response);
                res.send({ status: 200, message: 'Email Successfully Sent' })
                }
            });

    } catch (err) {
        return res.status(404).json({ status: 404, message: err.message })
    }
    
})

module.exports = router