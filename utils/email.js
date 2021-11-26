const nodemailer = require("nodemailer");
const catchAsync = require("../utils/catchAsync")

const sendEmail =  async options =>{
    // create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }

        // service: "Gmail",
        // auth:{
        //     user: process.env.EMAIL_USERNAME,
        //     pass: process.env.EMAIL_PASSWORD
        // }
        // activate in gmail "less secure app" option
    })


    // define the email options
    const mailOptions = {
        from: "Mihail Penev <mihail@penev.bg>",
        to: options.email,
        subject: options.subject,
        text: options.message
    };


    // actually send the email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail