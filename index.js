const cron = require('node-cron');
const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3003;

// Respond with a simple message to any requests
app.get('/', (req, res) => {
  res.send('Cron job service is running.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Function to check if there is an event tomorrow
function checkForEvent() {
    const events = JSON.parse(fs.readFileSync('events.json', 'utf8'));
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    return events[dateString];
}

async function sendEmail(eventDetails) {
    let transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.USER, // SendGrid provides an API Key instead of a username
            pass: process.env.SENDGRID_API_KEY // replace with your SendGrid API key
        }
    });

    let mailOptions = {
        from: '"Event Reminder" <bycheng.lai@gmail.com>', // sender address
        to: 'bycheng.lai@gmail.com', // list of receivers
        subject: 'Event Reminder for Tomorrow', // subject line
        text: `Don't forget about the event: ${eventDetails}`, // plain text body
        html: `<b>Don't forget about the event:</b> ${eventDetails}` // html body
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}

// Schedule the task to run every day at 10:00 AM
cron.schedule('45 23 * * *', () => {
    // const event = checkForEvent();
    // if (event) {
    //     sendEmail(event)
    //         .then(() => console.log('Email sent successfully!'))
    //         .catch(console.error);
    // } else {
    //     console.log('No event for tomorrow.');
    // }
    console.log('正在執行晚上 23:45 的檢查任務...');
});
