
function validation(){
	var username = document.getElementById("Username").value;
	var password = document.getElementById("Password").value;
	var password2 = document.getElementById("Password");
	var passwordRe = document.getElementById("PasswordRe").value;
	var passwordRe2 = document.getElementById("PasswordRe");
	var error_message = document.getElementById("error_message");
	var email = document.getElementById("E-mail").value;
	var email2 = document.getElementById("E-mail");
	var text;

	 error_message.style.padding = "10px";
	 error_message.style.position = "absolute";
	 error_message.style.bottom = "100px";
 	error_message.style.color = "red";

 	if(password.length < 8){
 		text = "Ο κωδικός πρέπει να περιέχει πάνω από 8 χαρακτήρες";
 		password2.style.border="2px solid red"
 		error_message.innerHTML = text;
 		return false;
 	}
 	else if(password.search(/[0-9]/)== -1){
 		text = "Ο κωδικός πρέπει να έχει τουλάχιστον 1 αριθμό";
 		password2.style.border="2px solid red"
 		error_message.innerHTML = text;
 		return false;
 	}
 	else if(password.search(/[A-Z]/)== -1){
 		text = "Ο κωδικός πρέπει να έχει τουλάχιστον 1 κεφαλαίο γράμμα";
 		password2.style.border="2px solid red";
 		error_message.innerHTML = text;
 		return false;
 	}
 	else if(password.search(/[!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/)== -1){
 		text = "Ο κωδικός πρέπει να έχει τουλάχιστον ένα σύμβολο";
 		password2.style.border="2px solid red";
 		error_message.innerHTML = text;
 		return false;
 	}
 	else if(passwordRe !== password){
 		text = "Οι δύο κωδικοί δεν είναι ίδιοι";
 		passwordRe2.style.border="2px solid red";
 		password2.style.border="2px solid red";
 		error_message.innerHTML = text;
 		return false;
 	}
 	else if(email.search(/[@]/)== -1){
 		text = "Παρακαλώ εισάγετε μία σωστή διεύθυνση e-mail";
 		email2.style.border="2px solid red";
 		error_message.innerHTML = text;
 		return false;
 	}
 	else if(email.search(/[.]/)== -1){
 		text = "Παρακαλώ εισάγετε μία σωστή διεύθυνση e-mail";
 		email2.style.border="2px solid red";
 		error_message.innerHTML = text;
 		return false;
 	}


 	else 
 	
 		return true;
 	
 	return false;
}

function Borders()
{	
	var username = document.getElementById("Username").value;
	var username2 = document.getElementById("Username");
	var password = document.getElementById("Password").value;
	var password2 = document.getElementById("Password");
	var passwordRe = document.getElementById("PasswordRe").value;
	var passwordRe2 = document.getElementById("PasswordRe");
	var error_message = document.getElementById("error_message");
	var email = document.getElementById("E-mail").value;
	var email2 = document.getElementById("E-mail");
	

 	if(username.length>1)
 	{
 		username2.style.border="2px solid green";
 		
 	}

 	else
 	{
 		username2.style.border="2px solid red"
 	}


 	if(password.length>8)
 	{
 		password2.style.border="2px solid green";
 		
 	}
 	
 	else
 	{
 		password2.style.border="2px solid red"
 	}

	if(passwordRe.length>8)
 	{
 		passwordRe2.style.border="2px solid green";
 		
 	}

 	else
 	{
 		passwordRe2.style.border="2px solid red"
 	}

    if(email.length>8){
 		
 		email2.style.border="2px solid green"
 		}
 	else
 	{
 		email2.style.border="2px solid red"
 	}
}
