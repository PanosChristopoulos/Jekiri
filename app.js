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
var ecoScoreGlobal = 0;
mongoose.connect("mongodb://localhost:27017/local");

var data = require('./data/Location_History.json')
var dedomena;
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
	date: Date,
	eco : Number,
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

		var contents = fs.readFileSync("./Location_History.json");
		userData.updateOne({ username : sess.username }, { $set: { date : Date.now() } });
		userData.create(
			{
				username: sess.username,
				data : JSON.parse(contents),
				date : Date.now()

				},function(err, userData){
					if (err){
						console.log(err);
							}
					else
					{
						res.redirect("/user");
						console.log(userData.date);
					}
				}			
			)

	//	mfile.mv("./data/"+filename,function(err){
		//	if(err)
		//		throw err;
		//	else
		//		res.redirect("/user");
		//})
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

	userData.find({username:sess.username})
	.select('date -_id')
	.exec(function(err,data){
		var date = data[3].date;
		var formalDate = date.toUTCString();
		console.log(date);
	
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){

		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data.locations;
		var arraylength = locations.length;
		var countEco = 0 ;
		var countVeh = 0;
		var countbs = 0;

		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			//.activity[j].activity[k].type;
			
				activity = locs.activity;
				if(activity){
				activities.push(activity);
				}
			}

				var	arraylength2 = activities.length;
				for(var j=0; j<arraylength2; j++)
				{
				type = activities[j][0].activity[0].type;
				
				if(type != 'UNKNOWN')
				types.push(type);
					
				}
				
					var arraylength3= types.length;
					console.log(arraylength3);
					for(var k=0; k<arraylength3; k++)
					{
						ecoOnes= ['ON_FOOT' , 'WALKING' , 'RUNNING' , 'ON_BICYCLE'];
						vehOnes=['IN_VEHICLE' , 'IN_ROAD_VEHICLE' , 'IN_RAIL_VEHICLE' , 'IN_FOUR_WHEELER_VEHICLE' , 'IN_CAR' ]
						
						if(ecoOnes.some(res=>types[k].includes(res))){
							countEco = countEco + 1;
						}
						else if(vehOnes.some( res=>types[k].includes(res))){
							countVeh = countVeh + 1;
						}
						else
							countbs = countbs +1 ;
					}
				ecoScoreGlobal = ((countEco / (countEco + countVeh))*100) | 0;

			userData.updateOne({ username : sess.username }, { $set: { eco: ecoScoreGlobal } });	
	

	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		var loc=data[0];
		var datas = JSON.stringify(loc);
		var datas2 = JSON.parse(datas);
		var mesa =datas2.data;
		var locs= mesa.locations;
		var arraylength=locs.length;
		

		times = [];

		for(var i=0; i<arraylength;i++){
			var time = locs[i].timestampMs;
			times.push(time);
		}
		
		for(var i=0; i<arraylength;i++){
			var min = times[0];
			var max = times[0];
			if(times[i]<min)
				min = times[i];
			else if(times[i]>max)
				max = times[i];


		}
		
		var minDate = new Date(parseInt(min));
		var maxDate = new Date(parseInt(max));
		var minDate2 = minDate.toDateString();
		var maxDate2 = maxDate.toDateString();
	
	userData.find({})
	.select('eco -_id')
	.exec(function(err,data){		
	console.log(data);
		
		
	if(sess.username){
	 return res.render("user",{name:sess.username,date:formalDate,eco:ecoScoreGlobal,startDate :minDate2, lastDate: maxDate2})
	}
	else{
	 return res.render("Login");
	}
    })
	})
	})
	})
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
	
	
app.get("/user/api",function(req,res){
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		var loc=data[0];
		var datas = JSON.stringify(loc);
		var datas2 = JSON.parse(datas);
		var mesa =datas2.data;
		var locs= mesa.locations;
		var arraylength=locs.length;
		let latitudes = [];
		let longitudes = [];
		
		for(var i=0; i<arraylength;i++){
			var latitude = locs[i].latitudeE7;
			latitudes.push(latitude/10000000);
		}

		for(var i=0; i<arraylength;i++){
			var longitude= locs[i].longitudeE7;
			longitudes.push(longitude/10000000);
		}
		let datat = [];
		for(var i=0; i<arraylength;i++){
			var o1 ={lat: latitudes[i],lng: longitudes[i],count : Math.floor(Math.random() * 9)};
			datat.push(o1);
		}

		let testData = {
			max:8,
			data: datat
		}
		dedomena = testData;
		var stringDedomena=JSON.stringify(dedomena);
		var jsonDedomena = JSON.parse(stringDedomena);
		res.json(jsonDedomena);
		
		
})
});

app.get("/Register",function(req,res){
	res.render("Register");
});






app.listen(3000,function (){
	console.log("Server is Running at port 3000");	
});