const { createTransport } = require("nodemailer");

exports.sendMail = async (emailToSend, subject, message) => {
  try {
    const auth = {
      email: process.env.NODEMAILER_EMAIL,
      password: process.env.NODEMAILER_PASSWORD,
    };

    const transporter = createTransport({
      port:process.env.NODEMAILER_PORT ,
      host: process.env.NODEMAILER_HOST,
      auth: {
        user: auth.email,
        pass: auth.password,
      },
      secure: true,
    });

    const mailData = {
      from: auth.email,
      to: emailToSend,
      subject: subject,
      html: `<div>${message}</div><br/><p>Message automatique à ne pas répondre.</p>`,
    };

    await transporter.sendMail(mailData);
    return `Message envoyé à ${emailToSend} avec succès!`;
  } catch (error) {
    return error;
  }
};
