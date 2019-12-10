function validation(){
	var username = document.getElementById("Username").value;
	var password = document.getElementById("Password").value;
	var passwordRe = document.getElementById("PasswordRe").value;
	var error_message = document.getElementById("error_message");
	var email = document.getElementById("E-mail").value;
	var text;

 	error_message.style.padding = "10px";
 	error_message.style.color = "red";

 	if(password.length < 8){
 		text = "Please enter at least 8 characters";
 		error_message.innerHTML = text;
 		return false;
 	}
 	else if(password.search(/[0-9]/)== -1){
 		text = "Please enter at least one numeric value";
 		error_message.innerHTML = text;
 		return false;
 	}
 	else if(password.search(/[A-Z]/)== -1){
 		text = "Please enter at least one UpperCase letter";
 		error_message.innerHTML = text;
 		return false;
 	}
 	else if(password.search(/[!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]/)== -1){
 		text = "Please enter at least one Symbol";
 		error_message.innerHTML = text;
 		return false;
 	}
 	else if(passwordRe !== password){
 		text = "Password don't match";
 		error_message.innerHTML = text;
 		return false;
 	}


 	else 
 		return true;
 	return false;
}


