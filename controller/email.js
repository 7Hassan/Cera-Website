const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport(
  {
    service: 'gmail',
    secure: false,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },

  });

const sendEmail = async (options) => {
  let message
  if (options.about == 'email') message = emailHtml(options)
  else message = passwordHtml(options)

  await transport.sendMail(
    {
      from: 'cera.shp@gmail.com',
      to: options.email,
      subject: options.subject,
      text: 'texting',
      html: message,
    })
}



function emailHtml(options) {
  return `<div>
  <h3>Verify your email address to complete registration</h3>
  <h4>Hi, ${options.name}</h4>
<p>
  Thanks for your interest in joining Cera!
  <br>
  To complete your registration, we need you to verify your email address.
</p>
<br>
<a href=${options.url}>
<button
   style="background-color: #14a800;
          border-color: transparent;
          color: white;border-radius: 20px;
          width: 200px;padding-bottom: 10px;
          padding-top: 10px;font-size: 13px;
          margin-top: 20px;font-weight: 600;">
  Verify Email</button></a>
  <br><br><br>
  <p>Thanks for your time,<br>The Cera Team</p>
  <p style="color:red; font-size:10px"> This message is available for 24 hours only</p></div>`
}


function passwordHtml(options) {
  return `<div>
  <h3>Reset your password to can log in</h3>
  <h4>Hi, ${options.name}</h4>
<p>
  Thanks for your interest in joining Cera!
  <br>
  To can log in, we need you to reset your password.
</p>
<br>
<a href=${options.url}>
<button
   style="background-color: #14a800;
          border-color: transparent;
          color: white;
          border-radius: 20px;
          width: 200px;
          padding-bottom: 10px;
          padding-top: 10px;
          font-size: 13px;
          margin-top: 20px;
          font-weight: 600;">
  Reset password</button></a>
<br><br><br>
<p>Thanks for your time,<br>The Cera Team</p>
<p style="color:red; font-size:10px"> This message is available for 30 minutes only</p></div>`
}

module.exports = sendEmail




