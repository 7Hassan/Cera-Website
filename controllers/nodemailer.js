const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport(
  {
    service: 'gmail',
    secure: false,
    host: 'smtp.gmail.com',
    auth: {
      user: 'cera.shp@gmail.com',
      pass: 'yqfpgikjypnbntem',
    },

  });




module.exports.sendConfirmationEmail = async () => {
  console.log("email");

  await transport.sendMail(
    {
      from: 'cera.shp@gmail.com',
      to: 'egoker1234@gmail.com',
      subject: 'Verify your email address',
      text: "texting",
      html: `
      <div>
        <h3>Verify your email address to complete registration</h3>
        <h4>Hi,Hassan</h4>
      <p>
        Thanks for your interest in joining Cera! To complete your registration, we need you to verify your email address.
      </p>
      <br>
      <a href=" 
         style="margin:auto;
                display: block;">
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
        The Upwork Team
      </p>
    </div>
      `,
    }).catch(err => console.log(err));
}











// let transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   // port: 587,
//   // secure: false, // true for 465, false for other ports
//   auth: {
//     user: 'egoker1234@gmail.com',
//     Pass: 'tfffrsss6',
//   },
// });

// // send mail with defined transport object
// exports.sendConfirmationEmail = async () => {
//   console.log("gmail")
//   await transporter.sendMail({
//     from: 'egoker1234@gmail.com', // sender address
//     to: "cera.shp@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   }).catch(err => console.log(err));

// }
