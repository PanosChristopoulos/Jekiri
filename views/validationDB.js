	function validationDB(){

	var username = document.getElementById("Username").value;
	var password = document.getElementById("Password").value;
	var password2 = document.getElementById("Password");
	var username2 = document.getElementById("Username");
	var error_message = document.getElementById("error_message");

	var sql = "select username,password from user where username='"+username+"'and password='"+password+"'";

	connection.query(sql,function(err, result){
		if(err) throw err;
		else{
			if (result != 0)
			res.redirect('/User');
			else{
				error_message.style.padding = "10px";
 				error_message.style.color = "red";
 				text = "Username or Password are incorrect";
 				password2.style.border="2px solid red"
 				error_message.innerHTML = text;
 		
			}
		}
	})
}






	