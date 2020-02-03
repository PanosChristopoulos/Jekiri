function validationDB(){
	var error_message = getElementById("error_message");
	var password2 = getElementById("Password");
	var username2 = getElementById("Username");
	error_message.style.padding = "10px";
 	error_message.style.color = "red";
 	password2.style.border="2px solid red";
 	username2.style.border="2px solid red";
 	text = "Username or Password is incorect";
 	error_message.innerHTML = text;
}






	