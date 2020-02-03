var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var CryptoJS = require('crypto-js');
const session = require('express-session');
const bcrypt = require('bcrypt');
var fs = require('fs');
var mongoose = require("mongoose");
var upload	= require('express-fileupload');
var cookieParser = require('cookie-parser');

mongoose.connect("mongodb://localhost:27017/local");

var data = require('./data/Location_History.json')
console.log(data);
app.use(session({
	name: 'session',
	saveUninitialized: true,
	resave: true,
	secret:'Welcome to our web ',
	cookie: { 
            secure: false,
            maxAge: 600000000000000
        }	
}));
var sess;
var dataSchema = new mongoose.Schema({
	username: String,
	data: Object,
});

var userData =mongoose.model("userData",dataSchema);


var userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	uniqueId: String,

});




userSchema.methods.comparePassword = function(candidatePassword,cb){
	bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
		if (err) return cb(err);
		cb(null,isMatch);
	});
}
var User = mongoose.model("User",userSchema);

app.use(cookieParser('Welcome to our web '));
app.use(upload());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine","ejs");






const redirectLogin =(req,res,next) =>{
	if(!req.session.User.username){
		res.redirect('/')
	}
	else
	{
		next()
	}
	};
app.get("/user/stats",function(req,res){
	sess = req.session;
	if(sess.username){
	 return res.render("stats",{name:sess.username});
	}
	else{
	 return res.render("Login");
	}
});

app.get("/",function(req,res){
	res.render("Login")
});

app.post("/user/upload",function(req,res){


	if(req.files){
		
		var mfile = req.files.filef;
		var filename = mfile.name;
		console.log(mfile);

		var contents = fs.readFileSync("./data/"+filename);

		userData.create(
			{
				username: sess.username,
				data : contents

				},function(err, userData){
					if (err){
						console.log(err);
							}
					else
					{
						console.log(userData);
					}
				}			
			)

		mfile.mv("./data/"+filename,function(err){
			if(err)
				throw err;
			else
				res.redirect("/user");
		})
	}

});

app.get("/user/upload",function(req,res){
	sess = req.session;
	if(sess.username){
	 return res.render("upload",{name:sess.username});
	}
	else{
	 return res.render("Login");
	}
});

app.post("/",function(req,res,next){
	sess = req.session;
	count(data);
	var	username = req.body.Username;
	 var password = req.body.Password;
	
	 
	console.log(password);

	
	//var sql1="select * from user where username='"+usernameForm+"'";
	User.findOne({username : username},function(err, user){
		console.log(user);
		if(err) throw err;

		user.comparePassword(password,function(err, isMatch){
			if(err) throw err;
			
			if(isMatch)
			{	

				sess.username = req.body.Username;
				//res.session.user.username=username;
				res.redirect('/user');
			}
		});
	});					
	});
	
app.get("/user/userprof",function(req,res){
	sess = req.session;
	if(sess.username){
	 return res.render("userprof",{name:sess.username});
	}
	else{
	 return res.render("Login");
	}
})

app.get("/user/help",function(req,res){
	sess = req.session;
	if(sess.username){
	 return res.render("help",{name:sess.username});
	}
	else{
	 return res.render("Login");
	}
})

app.get("/user/info",function(req,res){
	sess = req.session;
	if(sess.username){
	 return res.render("info",{name:sess.username});
	}
	else{
	 return res.render("Login");
	}
})

app.get("/user/credits",function(req,res){
	sess = req.session;
	if(sess.username){
	 return res.render("credits",{name:sess.username});
	}
	else{
	 return res.render("Login");
	}
})

app.get("/user/contact",function(req,res){
	sess = req.session;
	if(sess.username){
	 return res.render("contact",{name:sess.username});
	}
	else{
	 return res.render("Login");
	}
})

app.get("/user",function (req, res){
	sess = req.session;
	if(sess.username){
	 return res.render("user",{name:sess.username});
	}
	else{
	 return res.render("Login");
	}
});



app.post("/Register",function(req,res){
	var pass = req.body.Password;
	var email = req.body.Email;
	var username = req.body.FirstName;
	var userId = CryptoJS.AES.encrypt(email,pass);
	
		bcrypt.hash(pass,10,function(err,hash){
		User.create(
			{
				username: username,
				email: email,
				password: hash,
				uniqueId:userId 
				},function(err, User){
					if (err){
						console.log(err);
							}
					else
					{
						console.log(User);
					}
				}			
			)
			//var sql="insert into user(username,email,kwdikos,uniqueId) values ('"+req.body.FirstName +"','"+req.body.Email+"','"+hash+"','"+userId+"')";
		//connection.query(sql,function(err,result){
		if(err) throw err;
		else{
			res.redirect('/');
		console.log('added');
		}
	});
		});
	
	



app.get("/Register",function(req,res){
	res.render("Register");
});






app.listen(3000,function (){
	console.log("Server is Running at port 3000");	
});