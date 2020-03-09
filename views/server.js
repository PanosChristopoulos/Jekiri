require('dotenv').config();


function contact(){
var username = document.getElementById("fname").value;
var email = document.getElementById("lname").value;
var subject = document.getElementById("subject").value;

const nodemailer = require('nodemailer');

//step1

let transporter = nodemailer.createTransport({
        service: 'gmail',
            auth:{
                user: 'jekiriquestions@gmail.com',
                pass: 'BenficaMacau41'

}
});


let mailOptions = {
    from: 'jekiriquestions@gmail.com',
    to:'jekiricrowdsourcing@gmail.com',
    subject: 'Νέο μήνυμα της εφαρμογής Jekiri Crowdsourcing',
    text: 'Ο χρήστης '+ username+ 'με email'+email + 'έγραψε'+subject
}

transporter.sendMail(mailOptions, function(err,data){
    if(err){
        console.log('Error occurs');
    } else {console.log('Mail sent')};



})
}