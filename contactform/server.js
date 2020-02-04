require('dotenv').config();

const nodemailer = require('nodemailer');

//step1

let transporter = nodemailer.createTransport({
        service: 'gmail',
            auth:{
                user: 'jekiriquestions@gmail.com',
                pass: ''

}
});


let mailOptions = {
    from: 'jekiriquestions@gmail.com',
    to:'jekiricrowdsourcing@gmail.com',
    subject: 'Νέο μήνυμα της εφαρμογής Jekiri Crowdsourcing',
    text: `fbhasdkbfsajdkf`
}

transporter.sendMail(mailOptions, function(err,data){
    if(err){
        console.log('Error occurs');
    } else {console.log('Mail sent')};



})
