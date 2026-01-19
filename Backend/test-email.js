const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendTestEmail() {
    // Config based on user provided cPanel settings
    const transporter = nodemailer.createTransport({
        host: "mail.onchaintrustedcrypto.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "noreply@onchaintrustedcrypto.com",
            pass: process.env.SMTP_PASSWORD, // We will use the password from .env
        },
        // We might not need rejectUnauthorized: false since we have the correct settings now,
        // but keeping it as a fallback if the cert is self-signed or incomplete chain.
        // Ideally we try without it first to be secure, but for debugging let's stick to what works.
        // The user provided config says "Secure SSL/TLS Settings (Recommended)", so strict checking *should* work.
        tls: {
            // rejectUnauthorized: false 
        }
    });

    try {
        const info = await transporter.sendMail({
            from: '"Test Sender" <noreply@onchaintrustedcrypto.com>', // sender address
            to: "shimelsabraham123@gmail.com", // list of receivers
            subject: "Test Email from Backend Debugger", // Subject line
            text: "If you receive this, the email configuration is correct!", // plain text body
            html: "<b>If you receive this, the email configuration is correct!</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

sendTestEmail();
