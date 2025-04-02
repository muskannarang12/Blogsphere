
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail or any other email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

const sendVerificationEmail = async (email, code) => {
  console.log(`Attempting to send email to: ${email} with code: ${code}`);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "BlogSphere Verification Code",
    text: `Your verification code is: ${code}`,
  };

  try {
    console.log("Sending verification email...");
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (err) {
    console.error("Error sending verification email:", err.message);
  }
};


module.exports = sendVerificationEmail;