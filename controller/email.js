const nodemailer = require('nodemailer')
const ejs = require('ejs')
const htmlToText = require('html-to-text')
console.log('🚀 ~ htmlToText:', htmlToText)
// const transport = nodemailer.createTransport(
//   {
//     service: 'gmail',
//     secure: false,
//     host: 'smtp.gmail.com',
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },

//   });

// const sendEmail = async (options) => {
//   let message
//   if (options.about == 'email') message = emailHtml(options)
//   else message = passwordHtml(options)

//   await transport.sendMail(
//     {
//       from: 'cera.shp@gmail.com',
//       to: options.email,
//       subject: options.subject,
//       text: 'texting',
//       html: message,
//     })
// }



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

// module.exports = sendEmail






module.exports = class Email {
  constructor(user, url) {
    this.name = user.firstName,
      this.url = url,
      this.to = user.email,
      this.from = process.env.EMAIL_USERNAME
  }
  Transport() {
    return nodemailer.createTransport(
      {
        service: 'gmail',
        secure: false,
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
  }
  async send(template, subject) {
    //1) render template
    const html = await ejs.renderFile(`${__dirname}/../views/emails/${template}.ejs`, {
      name: this.name,
      url: this.url,
      subject
    })
    //2) email options
    const options = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: html,
    }
    //3) send email
    await this.Transport().sendMail(options)
  }
  async welcome() {
    await this.send('welcome', 'Welcome to Cera Shop')
  }
  async verify() {
    await this.send('verify', 'Verify Email Address')
  }
  async verify() {
    await this.send('verify', 'Verify Email Address')
  }
}
