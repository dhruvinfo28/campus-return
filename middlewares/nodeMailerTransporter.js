require('dotenv').config()
const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});