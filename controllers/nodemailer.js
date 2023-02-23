const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport(
  {
    service: 'gmail',
    secure: false,
    host: 'smtp.gmail.com',
    auth: {
      user: 'cera.shp@gmail.com',
      pass: 'qygfatsvshfzdlqb',
    },

  });


module.exports.sendConfirmationEmail = async (email, emailActivationCode, name) => {
  await transport.sendMail(
    {
      from: 'cera.shp@gmail.com',
      to: email,
      subject: 'Verify your email address',
      text: "texting",
      html: emailDesign(emailActivationCode, name),
    }).catch(err => console.log(err));
}



function emailDesign(emailActivationCode, name) {
  return `     
   <div>
  <h3>Verify your email address to complete registration</h3>
  <h4>Hi, ${name}</h4>
<p>
  Thanks for your interest in joining Cera!
  <br>
  To complete your registration, we need you to verify your email address.
</p>
<br>
<a href=http://localhost:8000/auth/sinup/verify/${emailActivationCode}>
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
  Verify Email</button></a>
<br>
<br>
<br>
<p>
  Thanks for your time,<br>
  The Cera Team
</p>
</div>
`
}










