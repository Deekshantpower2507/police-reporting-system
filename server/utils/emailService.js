const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using standard SMTP (Gmail by default for projects)
// If EMAIL_USER is not provided, we will just simulate the email in the console
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'test@example.com',
        pass: process.env.EMAIL_PASS || 'password'
    }
});

const sendEmail = async (to, subject, text, html) => {
    // If no real email is configured in .env, simulate it for the college project demo!
    if (!process.env.EMAIL_USER) {
        console.log('\n========================================================');
        console.log('📧 [SIMULATED EMAIL DISPATCHED] 📧');
        console.log(`TO: ${to}`);
        console.log(`SUBJECT: ${subject}`);
        console.log(`BODY:\n${text}`);
        console.log('========================================================\n');
        return true;
    }

    try {
        const info = await transporter.sendMail({
            from: `"Police Reporting System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });
        console.log(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendEmail };
