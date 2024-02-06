
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const ErrorResponse = require("../utils/errorResponse");

exports.sendEmail = async (outputMessage, senderEmail, subject, next) => {
    console.log("i was called");
    console.log(outputMessage, 'outputMessage')
    console.log(senderEmail, 'SendMail')
    console.log(subject, 'subject')
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID, // ClientID
        process.env.CLIENT_SECRET, // Client Secret
        process.env.REDIRECT_URL // Redirect URL
    );
    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });
    const accessToken = oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
    // send mail with defined transport object
    const mailOptions = {
        from: `"${process.env.SENDER_NAME}" <${process.env.EMAIL}>`, // sender address
        to: senderEmail.toString(), // list of receivers
        subject: subject.toString(), // Subject line
        html: outputMessage, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Mail sent : %s", info.response);
            // return next(new ErrorResponse("Mail sent : %s"  , 400));
        }
    });
}
