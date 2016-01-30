var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "jreynoldsdev@gmail.com",
       pass: process.env.EMAIL_SERVER_PASSWORD
   }
});

smtpTransport.sendMail({
   from: "My Name <jreynoldsdev@gmail.com>", // sender address
   to: "Your Name <jreynoldsdev@gmail.com>", // comma separated list of receivers
   subject: "Hello ✔", // Subject line
   text: "Hello world ✔" // plaintext body
}, function(error, response){
   if(error){
       console.log(error);
   }else{
       console.log("Message sent: " + response.message);
   }
   process.exit();
});

