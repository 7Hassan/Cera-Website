const nodemailer = require('nodemailer')
const ejs = require('ejs')
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
  async verify() { await this.send('verify', 'Verify Email Address') }
  async resetPass() { await this.send('resetPass', 'Reset a password') }
}
