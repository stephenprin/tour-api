import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const sendEmail = async (options: any) => { 
    //create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        //activate in gmail "less secure app" option
    })

    //define email options
    const mailOptions = {
        from: 'Prince Nmezi <princenmezi1994@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }


    //send email
    await transporter.sendMail(mailOptions)
}



export default sendEmail