var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "jreynoldsdev@gmail.com",
       pass: process.env.EMAIL_SERVER_PASSWORD
   }
});

smtpTransport.sendMail({
   from: "TrevorDillonArt Openshift Server <jreynoldsdev@gmail.com>", // sender address
   to: "Jacob Reynolds <jreynoldsdev@gmail.com>", // comma separated list of receivers
   subject: "Sever issue", // Subject line
   text: "The server appears to be down, please check immediately." // plaintext body
}, function(error, response){
   if(error){
       console.log(error);
   }else{
       console.log("Message sent: " + response.message);
   }
   process.exit();
});

