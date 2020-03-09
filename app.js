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
let confDates = [];
let confDatesUser=[];
const geolib = require('geolib');
const nodemailer = require('nodemailer');


mongoose.connect("mongodb://localhost:27017/local");

let transporter = nodemailer.createTransport({
        service: 'gmail',
            auth:{
                user: 'jekiriquestions@gmail.com',
                pass: 'BenficaMacau41'

}
});


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
	date:  Date,
	eco: {type:Number,default: 0 },	
	
});

var userData =mongoose.model("userData",dataSchema);

var adminSchema = new mongoose.Schema({
	username: String,
	password: String,
});





	adminSchema.methods.comparePassword = function(candidatePassword,cb){
	bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
		if (err) return cb(err);
		cb(null,isMatch);
	});
}
var admin = mongoose.model('admin',adminSchema);

var userSchema = new mongoose.Schema({
	username: { type : String , unique : true, required : true },
	email: String,
	password: String,
	data : Boolean,
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
		res.send(error);
	 return res.render("Login");
	}
});

app.get("/",function(req,res){
	res.render("Login")
});
app.get("/user/logout",function(req,res){
	req.session.destroy();
	res.render("Login");
})

app.get("/admin/logout",function(req,res){
	req.session.destroy();
	res.render("Login");
})

app.post("/user/upload",function(req,res){
	

	if(req.files){
		
		var mfile = req.files.filef;
		var filename = mfile.name;
		var aek = JSON.parse(mfile.data);
		var arraylength= aek.locations.length;
		var longitudes =[];
		var latitudes = [];
		var dataP = [];
		var correcti = [];
		
		for(var i=0; i<arraylength;i++){
			var latitude = aek.locations[i].latitudeE7;
			latitudes.push(latitude/10000000);

		}

		

		for(var i=0; i<arraylength;i++){
			var longitude= aek.locations[i].longitudeE7;
			longitudes.push(longitude/10000000);
		}

		for(var i=0; i<arraylength;i++){	
		var distance = geolib.isPointWithinRadius(
	   { latitude: latitudes[i], longitude: longitudes[i] },
       { latitude: 38.246242, longitude: 21.7350847 },
         10000
                );
			if(distance)
			{
				correcti.push(i);
				dataP.push(aek.locations[i]);
		    }
		    }

		   
		User.updateOne({ username : sess.username }, {  data : true  },{ upsert : true },function(err, userData){
					if (err){
						console.log(err);
							}
					else
					{
						
						console.log("o user uparxei");
					}
				});
		
		userData.updateOne(
			{	username : sess.username},
			{
				username: sess.username,
				data : dataP,
				date : Date.now()

			},
			{ upsert : true }
			,function(err, userData){
					if (err){
						console.log(err);
							}
					else
					{
						res.redirect("/user");
						
					}
				}			
			)

			}

});





app.get("/admin",function(req,res){
	var year1 = req.query.year1;
	var year2 = req.query.year2;
	var month1 = req.query.month1;
	var month2 = req.query.month2;
	var day1 = req.query.day1;
	var day2 = req.query.day2;
	var hour1 = req.query.hour1;
	var hour2 = req.query.hour2;
	var activity1 = req.query.activity1;

	var cDate1 = new Date(year1,month1,day1,hour1);

	var cDate2 = new Date(year2,month2,day2,hour2);
	confDates[0]= cDate1;
	confDates[1]= cDate2;
	
	sess =req.session;
	if(sess.username){
	 return res.render("admin",{name:sess.username});
	}
	else{
	 return res.render("Login");
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
	var ifAdmin = false;
	var	username = req.body.Username;
	 var password = req.body.Password;
	
	 

	admin.findOne({username : username},function(err, admin){
		if(admin){
		admin.comparePassword(password,function(err, isMatch1){
			if(err) throw err;

			if(isMatch1)
			{
				sess.username = req.body.Username;
				res.redirect('/admin');
				
			}
			
			});
	    }
		 });
		
		User.findOne({username : username},function(err, user){
			if(user)
			{
		//console.log(user);
		if(err) throw err;

		user.comparePassword(password,function(err, isMatch){
			if(err) throw err;
			
			if(isMatch)
			{	

				sess.username = req.body.Username;
				//res.session.user.username=username;
				res.redirect('/user');
			}
			else
				res.redirect('/');
		});
	}
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
app.post("/user/contact",function(req,res){
	
	let mailOptions = {
    from: 'jekiriquestions@gmail.com',
    to:'jekiricrowdsourcing@gmail.com',
    subject: 'Νέο μήνυμα της εφαρμογής Jekiri Crowdsourcing',
    text: " Ο χρήστης " + req.body.firstname + " με email  " +req.body.lastname + " έστειλε το μύνημα " + req.body.subject ,
}

transporter.sendMail(mailOptions, function(err,data){
    if(err){
        console.log('Error occurs');
    } else {console.log('Mail sent')};



})
	res.redirect("/user");
})

app.get("/user",function (req, res){
		var startDate = req.query.startdate;
		var endDate = req.query.enddate;
		confDatesUser[0]=startDate;
		confDatesUser[1]= endDate;
		sess = req.session;

	User.find({username:sess.username}).select('data -_id').exec(function(err,data){
		
		if(data[0].data)
		{
	userData.find({username:sess.username})
	.select('date -_id')
	.exec(function(err,data){
		var date = data[0].date;
		var formalDate = date.toUTCString();
		
	
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){


		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
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
				var ecouli = ecoScoreGlobal;

			userData.updateOne({ username : sess.username },  { eco: ecouli } ,{ upsert : true },function(err,data){});
				

					
			
		


	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		var loc=data[0];
		var datas = JSON.stringify(loc);
		var datas2 = JSON.parse(datas);
		var mesa =datas2.data;
		var locs= mesa;
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
	.select('eco username -_id')
	.exec(function(err,data){

		function compare(a,b){
			var firstEco =a.eco;
			var secondEco = b.eco;
			let comparison = 0;
			if(firstEco>secondEco)
				 comparison = -1;
			else if(secondEco> firstEco)
				comparison = 1;
			return comparison;
		}
		let secondLeaderboardName;
		let secondLeaderboardEco;
		let thirdLeaderboardName;
		let thirdLeaderboardEco;
		let currentPosition ;
		let sortedArray = data.sort(compare);
	let sorlength= sortedArray.length;
	for(var i=0;i<sorlength;i++)
	{
		if(sortedArray[i].username == sess.username)
			currentPosition= i+1;
	}

	let firstLeaderboardName = sortedArray[0].username;
	let firstLeaderboardEco = sortedArray[0].eco;
	if(sortedArray[1])
	{
	 secondLeaderboardName = sortedArray[1].username;
	 secondLeaderboardEco = sortedArray[1].eco;
    }
	if(sortedArray[2])
	{
	 thirdLeaderboardName = sortedArray[2].username;
	 thirdLeaderboardEco = sortedArray[2].eco;
	}	
		
	if(sess.username){
	 return res.render("user",{name:sess.username,date:formalDate,eco:ecoScoreGlobal,startDate :minDate2, lastDate: maxDate2,
	 	firstName:firstLeaderboardName,firstEco:firstLeaderboardEco,secondName:secondLeaderboardName,secondEco:secondLeaderboardEco,
	 	thirdName:thirdLeaderboardName,thirdEco:thirdLeaderboardEco,myPlace:currentPosition,myEco:ecoScoreGlobal})
	}
	else{
	 return res.render("Login");
	}
    
	})
	})
	})
	})
}

	else{
		if(sess.username){
	 return res.render("user",{name:sess.username,date:"-",eco:"0",startDate :"-", lastDate: "-",firstName: "-",firstEco:"-",secondName:"-",secondEco:"-",
	 	thirdName:"-",thirdEco:"-",myPlace:"-",myEco:"-"})
	}
	else{
	 return res.render("Login");
	}
	}

});
});



app.post("/Register",function(req,res){
	var pass = req.body.Password;
	var email = req.body.Email;
	var username = req.body.FirstName;
	var userId = CryptoJS.AES.encrypt(email,pass);
	
		bcrypt.hash(pass,10,function(err,hash){
			userData.create(
			{
				username :username,
			},function(err,userData){
				if(err){
					console.log(err);
				}
				else{}
			}
			)
		User.create(
			{
				username: username,
				email: email,
				password: hash,
				uniqueId:userId,
				data: false,
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
		
		}
	});
		});
	
	app.get("/user/api",function(req,res){

	
	User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		let datat = [];
		var startDate = Date.parse(confDatesUser[0]);
		
		var endDate = Date.parse(confDatesUser[1]);
		

		var loc=data[0];
		var datas = JSON.stringify(loc);
		var datas2 = JSON.parse(datas);
		var mesa =datas2.data;
		var locs= mesa;
		var arraylength=locs.length;
		let latitudes = [];
		let longitudes = [];
		
if(isNaN(startDate)== false)
		 {
		 	let latitudes = [];
		let longitudes = [];
		 	
			for(var i=0; i<arraylength;i++){
				
				tempDate = new Date(+locs[i].timestampMs);
				tempDate2 = new Date(+startDate);
				tempDate3 = new Date (+endDate);
				//console.log(tempDate2.getUTCFullYear() ,tempDate.getUTCFullYear() , tempDate3.getUTCFullYear());
            if(locs[i].timestampMs>startDate && locs[i].timestampMs<endDate)			
            {
				
			var latitude = locs[i].latitudeE7;
			if(latitude)
			latitudes.push(latitude/10000000);
			}
			else
				latitudes.push(0);
		}


		for(var i=0; i<arraylength;i++){
			tempDate = new Date(+locs[i].timestampMs);
				tempDate2 = new Date(+startDate);
				tempDate3 = new Date (+endDate);
			if(locs[i].timestampMs>startDate && locs[i].timestampMs<endDate)
			{
				var longitude= locs[i].longitudeE7;

				if(longitude)
			longitudes.push(longitude/10000000);
			}
			else
				longitudes.push(0);
		}

		for(var i=0; i<arraylength;i++){
			
			var o1 ={lat: latitudes[i],lng: longitudes[i],count :1};

			datat.push(o1);
		
		}
			
		}
		else{
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
		
		for(var i=0; i<arraylength;i++){
			var o1 ={lat: latitudes[i],lng: longitudes[i],count :1};

			datat.push(o1);
		}
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
}
});
});


	app.get("/user/api/graphA",function(req,res){

		User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		
		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var countInVehicle = 0 ;
		var countOnBicycle = 0;
		var countWalking = 0;
		var countRunning = 0;
		var countStill= 0;
		var graphData = [];

		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
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
					
					for(var k=0; k<arraylength3; k++)
					{
						inVehicle= ['VEHICLE'];
						onBicycle= ['BICYCLE'];
						walking = ['FOOT'];
						running = ['RUNNING'];
						still = ['STILL'];
						
						
						if(inVehicle.some(res=>types[k].includes(res))){
							countInVehicle = countInVehicle + 1;
						}
						else if(onBicycle.some( res=>types[k].includes(res))){
							countOnBicycle = countOnBicycle + 1;
						}
						else if(walking.some(res=>types[k].includes(res))){
							countWalking = countWalking + 1;
						}
						else if(running.some(res=>types[k].includes(res))){
							countRunning = countRunning + 1;
						}
						else if(still.some(res=>types[k].includes(res))){
							countStill = countStill + 1;
						}
						else
							{}
					}

					graphData[0]=countInVehicle;
					graphData[1]=countOnBicycle;
					graphData[2]=countWalking;
					graphData[3]=countRunning;
					graphData[4]=countStill;
					
					let finalGraphdata ={
    type: 'bar',
    data: {
        labels: ['Μεταφορικό Μέσο', 'Ποδήλατο', 'Περπάτημα', 'Τρέξιμο', 'Ακινησία'],
        datasets: [{
            label: 'Ποσοστό ανά Τύπο Δραστηριότητας',
            data: graphData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
}
		res.json(finalGraphdata);
})
}
	})	
});

	app.get("/user/api/cargraphA",function(req,res){

		User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		
		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var countsunday = 0 ;
		var countmonday = 0;
		var counttuesday = 0;
		var countwednesday = 0;
		var countthursday= 0;
		var countfriday= 0;
		var countsaturday = 0;
		var graphData = [];
		var timestamps = [];
		


		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
				activity = locs.activity;
				
			 	 if(activity){
			 	 	
			 		if(activity[0].activity[0].type == "IN_VEHICLE")
				timestamps.push(locs.timestampMs);
				}
				
				}	
			
		
			
				var arraylength3 = timestamps.length;
				
				
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					if (tempDate.getDay() == 0)
					countsunday = countsunday+1;
					else if(tempDate.getDay() == 1)
						countmonday = countmonday+1;
					else if(tempDate.getDay() == 2)
						counttuesday = counttuesday+1;
					else if(tempDate.getDay() == 3)
						countwednesday = countwednesday+1;
					else if(tempDate.getDay() == 4)
						countthursday = countthursday+1;
					else if(tempDate.getDay() == 5)
						countfriday = countfriday+1;
					else if(tempDate.getDay() == 6)
						countsaturday = countsaturday+1;

				}
					graphData[0] = countmonday;
					graphData[1] = counttuesday;
					graphData[2] = countwednesday;
					graphData[3] = countthursday;
					graphData[4] = countfriday;
					graphData[5] = countsaturday;
					graphData[6] = countsunday;

				let finalGraphdata ={
       type: 'line',
       data: {
           labels: ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'],
           datasets: [{
               label: 'Ποσοστό καταχωρήσεων ανά ημέρα',
               data: graphData,
               backgroundColor: [
                   'rgba(255, 99, 132, 0.5)',
                   'rgba(54, 162, 235, 0.5)',
                   'rgba(255, 206, 86, 0.5)',
                   'rgba(75, 192, 192, 0.5)',
                   'rgba(153, 102, 255, 0.5)',
                   'rgba(51, 233, 133, 0.5)',
                   'rgba(2, 27, 14, 0.5)'
               ],
           }]
       },
       options: {
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   }
		res.json(finalGraphdata);
})
}
	})	
});
	app.get("/user/api/bicyclegraphAd",function(req,res){

		User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		
		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var countsunday = 0 ;
		var countmonday = 0;
		var counttuesday = 0;
		var countwednesday = 0;
		var countthursday= 0;
		var countfriday= 0;
		var countsaturday = 0;
		var graphData = [];
		var timestamps = [];
		


		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
				activity = locs.activity;
				
			 	 if(activity){
			 	 	
			 		if(activity[0].activity[0].type == 'ON_BICYCLE')
				timestamps.push(locs.timestampMs);
				}
				
				}	
			
		
			
				var arraylength3 = timestamps.length;
				
				
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					if (tempDate.getDay() == 0)
					countsunday = countsunday+1;
					else if(tempDate.getDay() == 1)
						countmonday = countmonday+1;
					else if(tempDate.getDay() == 2)
						counttuesday = counttuesday+1;
					else if(tempDate.getDay() == 3)
						countwednesday = countwednesday+1;
					else if(tempDate.getDay() == 4)
						countthursday = countthursday+1;
					else if(tempDate.getDay() == 5)
						countfriday = countfriday+1;
					else if(tempDate.getDay() == 6)
						countsaturday = countsaturday+1;

				}
					graphData[0] = countmonday;
					graphData[1] = counttuesday;
					graphData[2] = countwednesday;
					graphData[3] = countthursday;
					graphData[4] = countfriday;
					graphData[5] = countsaturday;
					graphData[6] = countsunday;

				let finalGraphdata ={
       type: 'line',
       data: {
           labels: ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'],
           datasets: [{
               label: 'Ποσοστό καταχωρήσεων ανά ημέρα',
               data: graphData,
               backgroundColor: [
                   'rgba(255, 99, 132, 0.5)',
                   'rgba(54, 162, 235, 0.5)',
                   'rgba(255, 206, 86, 0.5)',
                   'rgba(75, 192, 192, 0.5)',
                   'rgba(153, 102, 255, 0.5)',
                   'rgba(51, 233, 133, 0.5)',
                   'rgba(2, 27, 14, 0.5)'
               ],
           }]
       },
       options: {
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   }
		res.json(finalGraphdata);
})
}
	})	
});
app.get("/user/api/runninggraphAd",function(req,res){

		User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		
		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var countsunday = 0 ;
		var countmonday = 0;
		var counttuesday = 0;
		var countwednesday = 0;
		var countthursday= 0;
		var countfriday= 0;
		var countsaturday = 0;
		var graphData = [];
		var timestamps = [];
		


		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
				activity = locs.activity;
				
			 	 if(activity){
			 	 	
			 		if(activity[0].activity[0].type == 'RUNNING')
				timestamps.push(locs.timestampMs);
				}
				
				}	
			
		
			
				var arraylength3 = timestamps.length;
				
				
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					if (tempDate.getDay() == 0)
					countsunday = countsunday+1;
					else if(tempDate.getDay() == 1)
						countmonday = countmonday+1;
					else if(tempDate.getDay() == 2)
						counttuesday = counttuesday+1;
					else if(tempDate.getDay() == 3)
						countwednesday = countwednesday+1;
					else if(tempDate.getDay() == 4)
						countthursday = countthursday+1;
					else if(tempDate.getDay() == 5)
						countfriday = countfriday+1;
					else if(tempDate.getDay() == 6)
						countsaturday = countsaturday+1;

				}
					graphData[0] = countmonday;
					graphData[1] = counttuesday;
					graphData[2] = countwednesday;
					graphData[3] = countthursday;
					graphData[4] = countfriday;
					graphData[5] = countsaturday;
					graphData[6] = countsunday;

				let finalGraphdata ={
       type: 'line',
       data: {
           labels: ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'],
           datasets: [{
               label: 'Ποσοστό καταχωρήσεων ανά ημέρα',
               data: graphData,
               backgroundColor: [
                   'rgba(255, 99, 132, 0.5)',
                   'rgba(54, 162, 235, 0.5)',
                   'rgba(255, 206, 86, 0.5)',
                   'rgba(75, 192, 192, 0.5)',
                   'rgba(153, 102, 255, 0.5)',
                   'rgba(51, 233, 133, 0.5)',
                   'rgba(2, 27, 14, 0.5)'
               ],
           }]
       },
       options: {
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   }
		res.json(finalGraphdata);
})
}
	})	
});
	app.get("/user/api/footgraphAd",function(req,res){

		User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		
		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var countsunday = 0 ;
		var countmonday = 0;
		var counttuesday = 0;
		var countwednesday = 0;
		var countthursday= 0;
		var countfriday= 0;
		var countsaturday = 0;
		var graphData = [];
		var timestamps = [];
		


		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
				activity = locs.activity;
				
			 	 if(activity){
			 	 	
			 		if(activity[0].activity[0].type == 'ON_FOOT')
				timestamps.push(locs.timestampMs);
				}
				
				}	
			
		
			
				var arraylength3 = timestamps.length;
				
				
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					if (tempDate.getDay() == 0)
					countsunday = countsunday+1;
					else if(tempDate.getDay() == 1)
						countmonday = countmonday+1;
					else if(tempDate.getDay() == 2)
						counttuesday = counttuesday+1;
					else if(tempDate.getDay() == 3)
						countwednesday = countwednesday+1;
					else if(tempDate.getDay() == 4)
						countthursday = countthursday+1;
					else if(tempDate.getDay() == 5)
						countfriday = countfriday+1;
					else if(tempDate.getDay() == 6)
						countsaturday = countsaturday+1;

				}
					graphData[0] = countmonday;
					graphData[1] = counttuesday;
					graphData[2] = countwednesday;
					graphData[3] = countthursday;
					graphData[4] = countfriday;
					graphData[5] = countsaturday;
					graphData[6] = countsunday;

				let finalGraphdata ={
       type: 'line',
       data: {
           labels: ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'],
           datasets: [{
               label: 'Ποσοστό καταχωρήσεων ανά ημέρα',
               data: graphData,
               backgroundColor: [
                   'rgba(255, 99, 132, 0.5)',
                   'rgba(54, 162, 235, 0.5)',
                   'rgba(255, 206, 86, 0.5)',
                   'rgba(75, 192, 192, 0.5)',
                   'rgba(153, 102, 255, 0.5)',
                   'rgba(51, 233, 133, 0.5)',
                   'rgba(2, 27, 14, 0.5)'
               ],
           }]
       },
       options: {
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   }
		res.json(finalGraphdata);
})
}
	})	
});
	app.get("/user/api/stillgraphAd",function(req,res){

		User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		
		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var countsunday = 0 ;
		var countmonday = 0;
		var counttuesday = 0;
		var countwednesday = 0;
		var countthursday= 0;
		var countfriday= 0;
		var countsaturday = 0;
		var graphData = [];
		var timestamps = [];
		


		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
				activity = locs.activity;
				
			 	 if(activity){
			 	 	
			 		if(activity[0].activity[0].type == 'STILL')
				timestamps.push(locs.timestampMs);
				}
				
				}	
			
		
			
				var arraylength3 = timestamps.length;
				
				
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					if (tempDate.getDay() == 0)
					countsunday = countsunday+1;
					else if(tempDate.getDay() == 1)
						countmonday = countmonday+1;
					else if(tempDate.getDay() == 2)
						counttuesday = counttuesday+1;
					else if(tempDate.getDay() == 3)
						countwednesday = countwednesday+1;
					else if(tempDate.getDay() == 4)
						countthursday = countthursday+1;
					else if(tempDate.getDay() == 5)
						countfriday = countfriday+1;
					else if(tempDate.getDay() == 6)
						countsaturday = countsaturday+1;

				}
					graphData[0] = countmonday;
					graphData[1] = counttuesday;
					graphData[2] = countwednesday;
					graphData[3] = countthursday;
					graphData[4] = countfriday;
					graphData[5] = countsaturday;
					graphData[6] = countsunday;

				let finalGraphdata ={
       type: 'line',
       data: {
           labels: ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'],
           datasets: [{
               label: 'Ποσοστό καταχωρήσεων ανά ημέρα',
               data: graphData,
               backgroundColor: [
                   'rgba(255, 99, 132, 0.5)',
                   'rgba(54, 162, 235, 0.5)',
                   'rgba(255, 206, 86, 0.5)',
                   'rgba(75, 192, 192, 0.5)',
                   'rgba(153, 102, 255, 0.5)',
                   'rgba(51, 233, 133, 0.5)',
                   'rgba(2, 27, 14, 0.5)'
               ],
           }]
       },
       options: {
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   }
		res.json(finalGraphdata);
})
}
	})	
});

	app.get("/user/api/stillgraphBd",function(req,res){

		User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		
		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var count0 = 0;
		var count1 = 0;
		var count2 = 0;
		var count3 = 0;
		var count4 = 0;
		var count5 = 0;
		var count6 = 0;
		var count7 = 0;
		var count8 = 0;
		var count9 = 0;
		var count10 = 0;
		var count11 = 0;
		var count12 = 0;
		var count13 = 0;
		var count14 = 0;
		var count15 = 0;
		var count16 = 0;
		var count18 = 0;
		var count17 = 0;
		var count19 = 0;
		var count20 = 0;
		var count21 = 0;
		var count22 = 0;
		var count23 = 0;
		var graphData = [];
		var timestamps = [];
		


		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
				activity = locs.activity;
				
			 	 if(activity){
			 	 	
			 		if(activity[0].activity[0].type == 'STILL')
				timestamps.push(locs.timestampMs);
				}
				
				}	
			
		
			
				var arraylength3 = timestamps.length;
				
				
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					
					if(tempDate.getHours() == 0)
						count0 = count0+1;
					else if(tempDate.getHours() == 1)
						count1 = count1+1;
					else if(tempDate.getHours() == 2)
						count2 = count2+1;
					else if(tempDate.getHours() == 3)
						count3 = count3+1;
					else if(tempDate.getHours() == 4)
						count4 = count4+1;
					else if(tempDate.getHours() == 5)
						count5 = count5+1;
					else if(tempDate.getHours() == 6)
						count6 = count6+1;
					else if(tempDate.getHours() == 7)
						count7 = count7+1;
					else if(tempDate.getHours() == 8)
						count8 = count8+1;
					else if(tempDate.getHours() == 9)
						count9 = count9+1;
					else if(tempDate.getHours() == 10)
						count10 = count10+1;
					else if(tempDate.getHours() == 11)
						count11 = count11+1;
					else if(tempDate.getHours() == 12)
						count12 = count12+1;
					else if(tempDate.getHours() == 13)
						count13 = count13+1;
					else if(tempDate.getHours() == 14)
						count14 = count14+1;
					else if(tempDate.getHours() == 15)
						count15 = count15+1;
					else if(tempDate.getHours() == 16)
						count16 = count16+1;
					else if(tempDate.getHours() == 17)
						count17 = count17+1;
					else if(tempDate.getHours() == 18)
						count18 = count18+1;
					else if(tempDate.getHours() == 19)
						count19 = count19+1;
					else if(tempDate.getHours() == 20)
						count20 = count20+1;
					else if(tempDate.getHours() == 21)
						count21 = count21+1;
					else if(tempDate.getHours() == 22)
						count22 = count22+1;
					else if(tempDate.getHours() == 23)
						count23 = count23+1;

				}
					graphData[0] = count0;
					graphData[1] = count1;
					graphData[2] = count2;
					graphData[3] = count3;
					graphData[4] = count4;
					graphData[5] = count5;
					graphData[6] = count6;
					graphData[7] = count7;
					graphData[8] = count8;
					graphData[9] = count9;
					graphData[10] = count10;
					graphData[11] = count11;
					graphData[12] = count12;
					graphData[13] = count13;
					graphData[14] = count14;
					graphData[15] = count15;
					graphData[16] = count16;
					graphData[17] = count17;
					graphData[18] = count18;
					graphData[19] = count19;
					graphData[20] = count20;
					graphData[21] = count21;
					graphData[22] = count22;
					graphData[23] = count23;
					

				let finalGraphdata ={
       type: 'bar',
       data: {
           labels: ['1 π.μ.', '2 π.μ.', '3 π.μ.', '4 π.μ.', '5 π.μ.', '6 π.μ.', '7 π.μ.', '8 π.μ.', '9 π.μ.', '10 π.μ.', '11 π.μ.', '12 π.μ.', '1 μ.μ.', '2 μ.μ.', '3 μ.μ.', '4 μ.μ.', '5 μ.μ.', '6 μ.μ.', '7 μ.μ.', '8 μ.μ.', '9 μ.μ.', '10 μ.μ.', '11 μ.μ.', '12 μ.μ.'],
           datasets: [{
               label: 'Ποσοστό εγγραφών ανά ώρα',
               data: graphData,
               backgroundColor: [ 
               'rgba(2, 27, 14, 0.5)' , 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)',
               'rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)',
               'rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)'
               ],
           }]
       },
       options: {
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   
   }
		res.json(finalGraphdata);
})
}
})
});

app.get("/user/api/runninggraphBd",function(req,res){

		User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		
		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var count0 = 0;
		var count1 = 0;
		var count2 = 0;
		var count3 = 0;
		var count4 = 0;
		var count5 = 0;
		var count6 = 0;
		var count7 = 0;
		var count8 = 0;
		var count9 = 0;
		var count10 = 0;
		var count11 = 0;
		var count12 = 0;
		var count13 = 0;
		var count14 = 0;
		var count15 = 0;
		var count16 = 0;
		var count18 = 0;
		var count17 = 0;
		var count19 = 0;
		var count20 = 0;
		var count21 = 0;
		var count22 = 0;
		var count23 = 0;
		var graphData = [];
		var timestamps = [];
		


		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
				activity = locs.activity;
				
			 	 if(activity){
			 	 	
			 		if(activity[0].activity[0].type == 'RUNNING')
				timestamps.push(locs.timestampMs);
				}
				
				}	
			
		
			
				var arraylength3 = timestamps.length;
				
				
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					
					if(tempDate.getHours() == 0)
						count0 = count0+1;
					else if(tempDate.getHours() == 1)
						count1 = count1+1;
					else if(tempDate.getHours() == 2)
						count2 = count2+1;
					else if(tempDate.getHours() == 3)
						count3 = count3+1;
					else if(tempDate.getHours() == 4)
						count4 = count4+1;
					else if(tempDate.getHours() == 5)
						count5 = count5+1;
					else if(tempDate.getHours() == 6)
						count6 = count6+1;
					else if(tempDate.getHours() == 7)
						count7 = count7+1;
					else if(tempDate.getHours() == 8)
						count8 = count8+1;
					else if(tempDate.getHours() == 9)
						count9 = count9+1;
					else if(tempDate.getHours() == 10)
						count10 = count10+1;
					else if(tempDate.getHours() == 11)
						count11 = count11+1;
					else if(tempDate.getHours() == 12)
						count12 = count12+1;
					else if(tempDate.getHours() == 13)
						count13 = count13+1;
					else if(tempDate.getHours() == 14)
						count14 = count14+1;
					else if(tempDate.getHours() == 15)
						count15 = count15+1;
					else if(tempDate.getHours() == 16)
						count16 = count16+1;
					else if(tempDate.getHours() == 17)
						count17 = count17+1;
					else if(tempDate.getHours() == 18)
						count18 = count18+1;
					else if(tempDate.getHours() == 19)
						count19 = count19+1;
					else if(tempDate.getHours() == 20)
						count20 = count20+1;
					else if(tempDate.getHours() == 21)
						count21 = count21+1;
					else if(tempDate.getHours() == 22)
						count22 = count22+1;
					else if(tempDate.getHours() == 23)
						count23 = count23+1;

				}
					graphData[0] = count0;
					graphData[1] = count1;
					graphData[2] = count2;
					graphData[3] = count3;
					graphData[4] = count4;
					graphData[5] = count5;
					graphData[6] = count6;
					graphData[7] = count7;
					graphData[8] = count8;
					graphData[9] = count9;
					graphData[10] = count10;
					graphData[11] = count11;
					graphData[12] = count12;
					graphData[13] = count13;
					graphData[14] = count14;
					graphData[15] = count15;
					graphData[16] = count16;
					graphData[17] = count17;
					graphData[18] = count18;
					graphData[19] = count19;
					graphData[20] = count20;
					graphData[21] = count21;
					graphData[22] = count22;
					graphData[23] = count23;
					

				let finalGraphdata ={
       type: 'bar',
       data: {
           labels: ['1 π.μ.', '2 π.μ.', '3 π.μ.', '4 π.μ.', '5 π.μ.', '6 π.μ.', '7 π.μ.', '8 π.μ.', '9 π.μ.', '10 π.μ.', '11 π.μ.', '12 π.μ.', '1 μ.μ.', '2 μ.μ.', '3 μ.μ.', '4 μ.μ.', '5 μ.μ.', '6 μ.μ.', '7 μ.μ.', '8 μ.μ.', '9 μ.μ.', '10 μ.μ.', '11 μ.μ.', '12 μ.μ.'],
           datasets: [{
               label: 'Ποσοστό εγγραφών ανά ώρα',
               data: graphData,
               backgroundColor: [ 
               'rgba(2, 27, 14, 0.5)' , 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)',
               'rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)',
               'rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)'
               ],
           }]
       },
       options: {
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   
   }
		res.json(finalGraphdata);
})
}
})
});

app.get("/user/api/footgraphBd",function(req,res){

		User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		
		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var count0 = 0;
		var count1 = 0;
		var count2 = 0;
		var count3 = 0;
		var count4 = 0;
		var count5 = 0;
		var count6 = 0;
		var count7 = 0;
		var count8 = 0;
		var count9 = 0;
		var count10 = 0;
		var count11 = 0;
		var count12 = 0;
		var count13 = 0;
		var count14 = 0;
		var count15 = 0;
		var count16 = 0;
		var count18 = 0;
		var count17 = 0;
		var count19 = 0;
		var count20 = 0;
		var count21 = 0;
		var count22 = 0;
		var count23 = 0;
		var graphData = [];
		var timestamps = [];
		


		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
				activity = locs.activity;
				
			 	 if(activity){
			 	 	
			 		if(activity[0].activity[0].type == 'ON_FOOT')
				timestamps.push(locs.timestampMs);
				}
				
				}	
			
		
			
				var arraylength3 = timestamps.length;
				
				
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					
					if(tempDate.getHours() == 0)
						count0 = count0+1;
					else if(tempDate.getHours() == 1)
						count1 = count1+1;
					else if(tempDate.getHours() == 2)
						count2 = count2+1;
					else if(tempDate.getHours() == 3)
						count3 = count3+1;
					else if(tempDate.getHours() == 4)
						count4 = count4+1;
					else if(tempDate.getHours() == 5)
						count5 = count5+1;
					else if(tempDate.getHours() == 6)
						count6 = count6+1;
					else if(tempDate.getHours() == 7)
						count7 = count7+1;
					else if(tempDate.getHours() == 8)
						count8 = count8+1;
					else if(tempDate.getHours() == 9)
						count9 = count9+1;
					else if(tempDate.getHours() == 10)
						count10 = count10+1;
					else if(tempDate.getHours() == 11)
						count11 = count11+1;
					else if(tempDate.getHours() == 12)
						count12 = count12+1;
					else if(tempDate.getHours() == 13)
						count13 = count13+1;
					else if(tempDate.getHours() == 14)
						count14 = count14+1;
					else if(tempDate.getHours() == 15)
						count15 = count15+1;
					else if(tempDate.getHours() == 16)
						count16 = count16+1;
					else if(tempDate.getHours() == 17)
						count17 = count17+1;
					else if(tempDate.getHours() == 18)
						count18 = count18+1;
					else if(tempDate.getHours() == 19)
						count19 = count19+1;
					else if(tempDate.getHours() == 20)
						count20 = count20+1;
					else if(tempDate.getHours() == 21)
						count21 = count21+1;
					else if(tempDate.getHours() == 22)
						count22 = count22+1;
					else if(tempDate.getHours() == 23)
						count23 = count23+1;

				}
					graphData[0] = count0;
					graphData[1] = count1;
					graphData[2] = count2;
					graphData[3] = count3;
					graphData[4] = count4;
					graphData[5] = count5;
					graphData[6] = count6;
					graphData[7] = count7;
					graphData[8] = count8;
					graphData[9] = count9;
					graphData[10] = count10;
					graphData[11] = count11;
					graphData[12] = count12;
					graphData[13] = count13;
					graphData[14] = count14;
					graphData[15] = count15;
					graphData[16] = count16;
					graphData[17] = count17;
					graphData[18] = count18;
					graphData[19] = count19;
					graphData[20] = count20;
					graphData[21] = count21;
					graphData[22] = count22;
					graphData[23] = count23;
					

				let finalGraphdata ={
       type: 'bar',
       data: {
           labels: ['1 π.μ.', '2 π.μ.', '3 π.μ.', '4 π.μ.', '5 π.μ.', '6 π.μ.', '7 π.μ.', '8 π.μ.', '9 π.μ.', '10 π.μ.', '11 π.μ.', '12 π.μ.', '1 μ.μ.', '2 μ.μ.', '3 μ.μ.', '4 μ.μ.', '5 μ.μ.', '6 μ.μ.', '7 μ.μ.', '8 μ.μ.', '9 μ.μ.', '10 μ.μ.', '11 μ.μ.', '12 μ.μ.'],
           datasets: [{
               label: 'Ποσοστό εγγραφών ανά ώρα',
               data: graphData,
               backgroundColor: [ 
               'rgba(2, 27, 14, 0.5)' , 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)',
               'rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)',
               'rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)'
               ],
           }]
       },
       options: {
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   
   }
		res.json(finalGraphdata);
})
}
})
});
app.get("/user/api/bicgraphBd",function(req,res){

		User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		
		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var count0 = 0;
		var count1 = 0;
		var count2 = 0;
		var count3 = 0;
		var count4 = 0;
		var count5 = 0;
		var count6 = 0;
		var count7 = 0;
		var count8 = 0;
		var count9 = 0;
		var count10 = 0;
		var count11 = 0;
		var count12 = 0;
		var count13 = 0;
		var count14 = 0;
		var count15 = 0;
		var count16 = 0;
		var count18 = 0;
		var count17 = 0;
		var count19 = 0;
		var count20 = 0;
		var count21 = 0;
		var count22 = 0;
		var count23 = 0;
		var graphData = [];
		var timestamps = [];
		


		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
				activity = locs.activity;
				
			 	 if(activity){
			 	 	
			 		if(activity[0].activity[0].type == 'ON_BICYCLE')
				timestamps.push(locs.timestampMs);
				}
				
				}	
			
		
			
				var arraylength3 = timestamps.length;
				
				
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					
					if(tempDate.getHours() == 0)
						count0 = count0+1;
					else if(tempDate.getHours() == 1)
						count1 = count1+1;
					else if(tempDate.getHours() == 2)
						count2 = count2+1;
					else if(tempDate.getHours() == 3)
						count3 = count3+1;
					else if(tempDate.getHours() == 4)
						count4 = count4+1;
					else if(tempDate.getHours() == 5)
						count5 = count5+1;
					else if(tempDate.getHours() == 6)
						count6 = count6+1;
					else if(tempDate.getHours() == 7)
						count7 = count7+1;
					else if(tempDate.getHours() == 8)
						count8 = count8+1;
					else if(tempDate.getHours() == 9)
						count9 = count9+1;
					else if(tempDate.getHours() == 10)
						count10 = count10+1;
					else if(tempDate.getHours() == 11)
						count11 = count11+1;
					else if(tempDate.getHours() == 12)
						count12 = count12+1;
					else if(tempDate.getHours() == 13)
						count13 = count13+1;
					else if(tempDate.getHours() == 14)
						count14 = count14+1;
					else if(tempDate.getHours() == 15)
						count15 = count15+1;
					else if(tempDate.getHours() == 16)
						count16 = count16+1;
					else if(tempDate.getHours() == 17)
						count17 = count17+1;
					else if(tempDate.getHours() == 18)
						count18 = count18+1;
					else if(tempDate.getHours() == 19)
						count19 = count19+1;
					else if(tempDate.getHours() == 20)
						count20 = count20+1;
					else if(tempDate.getHours() == 21)
						count21 = count21+1;
					else if(tempDate.getHours() == 22)
						count22 = count22+1;
					else if(tempDate.getHours() == 23)
						count23 = count23+1;

				}
					graphData[0] = count0;
					graphData[1] = count1;
					graphData[2] = count2;
					graphData[3] = count3;
					graphData[4] = count4;
					graphData[5] = count5;
					graphData[6] = count6;
					graphData[7] = count7;
					graphData[8] = count8;
					graphData[9] = count9;
					graphData[10] = count10;
					graphData[11] = count11;
					graphData[12] = count12;
					graphData[13] = count13;
					graphData[14] = count14;
					graphData[15] = count15;
					graphData[16] = count16;
					graphData[17] = count17;
					graphData[18] = count18;
					graphData[19] = count19;
					graphData[20] = count20;
					graphData[21] = count21;
					graphData[22] = count22;
					graphData[23] = count23;
					

				let finalGraphdata ={
       type: 'bar',
       data: {
           labels: ['1 π.μ.', '2 π.μ.', '3 π.μ.', '4 π.μ.', '5 π.μ.', '6 π.μ.', '7 π.μ.', '8 π.μ.', '9 π.μ.', '10 π.μ.', '11 π.μ.', '12 π.μ.', '1 μ.μ.', '2 μ.μ.', '3 μ.μ.', '4 μ.μ.', '5 μ.μ.', '6 μ.μ.', '7 μ.μ.', '8 μ.μ.', '9 μ.μ.', '10 μ.μ.', '11 μ.μ.', '12 μ.μ.'],
           datasets: [{
               label: 'Ποσοστό εγγραφών ανά ώρα',
               data: graphData,
               backgroundColor: [ 
               'rgba(2, 27, 14, 0.5)' , 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)',
               'rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)',
               'rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)'
               ],
           }]
       },
       options: {
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   
   }
		res.json(finalGraphdata);
})
}
})
});

app.get("/user/api/cargraphBd",function(req,res){

		User.find({username:sess.username}).select('data -_id').exec(function(err,data){

	if(data[0].data)
	{
	userData.find({username:sess.username})
	.select('data -_id')
	.exec(function(err,data){
		
		
		var types = [];
		var activities = [];
		var accessdata = data[0];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var count0 = 0;
		var count1 = 0;
		var count2 = 0;
		var count3 = 0;
		var count4 = 0;
		var count5 = 0;
		var count6 = 0;
		var count7 = 0;
		var count8 = 0;
		var count9 = 0;
		var count10 = 0;
		var count11 = 0;
		var count12 = 0;
		var count13 = 0;
		var count14 = 0;
		var count15 = 0;
		var count16 = 0;
		var count18 = 0;
		var count17 = 0;
		var count19 = 0;
		var count20 = 0;
		var count21 = 0;
		var count22 = 0;
		var count23 = 0;
		var graphData = [];
		var timestamps = [];
		


		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
				activity = locs.activity;
				
			 	 if(activity){
			 	 	
			 		if(activity[0].activity[0].type == 'IN_VEHICLE')
				timestamps.push(locs.timestampMs);
				}
				
				}	
			
		
			
				var arraylength3 = timestamps.length;
				
				
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					
					if(tempDate.getHours() == 0)
						count0 = count0+1;
					else if(tempDate.getHours() == 1)
						count1 = count1+1;
					else if(tempDate.getHours() == 2)
						count2 = count2+1;
					else if(tempDate.getHours() == 3)
						count3 = count3+1;
					else if(tempDate.getHours() == 4)
						count4 = count4+1;
					else if(tempDate.getHours() == 5)
						count5 = count5+1;
					else if(tempDate.getHours() == 6)
						count6 = count6+1;
					else if(tempDate.getHours() == 7)
						count7 = count7+1;
					else if(tempDate.getHours() == 8)
						count8 = count8+1;
					else if(tempDate.getHours() == 9)
						count9 = count9+1;
					else if(tempDate.getHours() == 10)
						count10 = count10+1;
					else if(tempDate.getHours() == 11)
						count11 = count11+1;
					else if(tempDate.getHours() == 12)
						count12 = count12+1;
					else if(tempDate.getHours() == 13)
						count13 = count13+1;
					else if(tempDate.getHours() == 14)
						count14 = count14+1;
					else if(tempDate.getHours() == 15)
						count15 = count15+1;
					else if(tempDate.getHours() == 16)
						count16 = count16+1;
					else if(tempDate.getHours() == 17)
						count17 = count17+1;
					else if(tempDate.getHours() == 18)
						count18 = count18+1;
					else if(tempDate.getHours() == 19)
						count19 = count19+1;
					else if(tempDate.getHours() == 20)
						count20 = count20+1;
					else if(tempDate.getHours() == 21)
						count21 = count21+1;
					else if(tempDate.getHours() == 22)
						count22 = count22+1;
					else if(tempDate.getHours() == 23)
						count23 = count23+1;

				}
					graphData[0] = count0;
					graphData[1] = count1;
					graphData[2] = count2;
					graphData[3] = count3;
					graphData[4] = count4;
					graphData[5] = count5;
					graphData[6] = count6;
					graphData[7] = count7;
					graphData[8] = count8;
					graphData[9] = count9;
					graphData[10] = count10;
					graphData[11] = count11;
					graphData[12] = count12;
					graphData[13] = count13;
					graphData[14] = count14;
					graphData[15] = count15;
					graphData[16] = count16;
					graphData[17] = count17;
					graphData[18] = count18;
					graphData[19] = count19;
					graphData[20] = count20;
					graphData[21] = count21;
					graphData[22] = count22;
					graphData[23] = count23;
					

				let finalGraphdata ={
       type: 'bar',
       data: {
           labels: ['1 π.μ.', '2 π.μ.', '3 π.μ.', '4 π.μ.', '5 π.μ.', '6 π.μ.', '7 π.μ.', '8 π.μ.', '9 π.μ.', '10 π.μ.', '11 π.μ.', '12 π.μ.', '1 μ.μ.', '2 μ.μ.', '3 μ.μ.', '4 μ.μ.', '5 μ.μ.', '6 μ.μ.', '7 μ.μ.', '8 μ.μ.', '9 μ.μ.', '10 μ.μ.', '11 μ.μ.', '12 μ.μ.'],
           datasets: [{
               label: 'Ποσοστό εγγραφών ανά ώρα',
               data: graphData,
               backgroundColor: [ 
               'rgba(2, 27, 14, 0.5)' , 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)', 'rgba(2, 27, 14, 0.5)',
               'rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)',
               'rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)','rgba(2, 27, 14, 0.5)'
               ],
           }]
       },
       options: {
           scales: {
               yAxes: [{
                   ticks: {
                       beginAtZero: true
                   }
               }]
           }
       }
   
   }
		res.json(finalGraphdata);
})
}
})
});

app.get("/adminstats",function(req,res){
	sess = req.session;
	if(sess.username){
	 return res.render("adminstats",{name:sess.username});
	}
	else{
	 return res.render("Login");
	}
});

app.get("/admin/export",function(req,res){
	sess = req.session;
	if(sess.username){
	 return res.render("export",{name:sess.username});
	}
	else{
	 return res.render("Login");
	}
});

app.get("/admin/delete",function(req,res){
	sess = req.session;
	if(sess.username){
	 return res.render("delete",{name:sess.username});
	}
	else{
	 return res.render("Login");
	}
});

app.delete("/admin/delete",function(req,res){
	sess = req.session;
	
		userData.remove({}, callback);
	
	
});

app.get("/admin/apiType",function(req,res)
{	

	userData.find({})
	.select('data -_id')
	.exec(function(err,data){
		
		
		
		var countInVehicle = 0 ;
		var countOnBicycle = 0;
		var countWalking = 0;
		var countRunning = 0;
		var countStill= 0;
		var userDatalength= data.length;
		for(var p=0;p<userDatalength;p++)
		{
		var accessdata = data[p];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var types = [];
		var activities = [];
		var graphData = [];

		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
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
					
					for(var k=0; k<arraylength3; k++)
					{
						inVehicle= ['IN_VEHICLE'];
						onBicycle= ['ON_BICYCLE'];
						walking = ['ON_FOOT'];
						running = ['RUNNING'];
						still = ['STILL'];
						
						
						if(inVehicle.some(res=>types[k].includes(res))){
							countInVehicle = countInVehicle + 1;
						}
						else if(onBicycle.some( res=>types[k].includes(res))){
							countOnBicycle = countOnBicycle + 1;
						}
						else if(walking.some(res=>types[k].includes(res))){
							countWalking = countWalking + 1;
						}
						else if(running.some(res=>types[k].includes(res))){
							countRunning = countRunning + 1;
						}
						else if(still.some(res=>types[k].includes(res))){
							countStill = countStill + 1;
						}
						else
							{}
					}
				}
				
					graphData[0]=countInVehicle;
					graphData[1]=countOnBicycle;
					graphData[2]=countWalking;
					graphData[3]=countRunning;
					graphData[4]=countStill;
				
					let finalGraphdata ={
    type: 'bar',
    data: {
        labels: ['Μεταφορικό Μέσο', 'Ποδήλατο', 'Περπάτημα', 'Τρέξιμο', 'Ακινησία'],
        datasets: [{
            label: 'Ποσοστό ανά Τύπο Δραστηριότητας',
            data: graphData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
}

		res.json(finalGraphdata);

})
});

app.get("/admin/apiHours",function(req,res)
{	
		var hours = [];
		var count0 = 0;
		var count1 = 0;
		var count2 = 0;
		var count3 = 0;
		var count4 = 0;
		var count5 = 0;
		var count6 = 0;
		var count7 = 0;
		var count8 = 0;
		var count9 = 0;
		var count10 = 0;
		var count11 = 0;
		var count12 = 0;
		var count13 = 0;
		var count14 = 0;
		var count15 = 0;
		var count16 = 0;
		var count17 = 0;
		var count18 = 0;
		var count19 = 0;
		var count20 = 0;
		var count21 = 0;
		var count22 = 0;
		var count23 = 0;
	userData.find({})
	.select('data -_id')
	.exec(function(err,data){
		
		
		
		var userDatalength= data.length;
		
		for(var p=0;p<userDatalength;p++)
		{
		var accessdata = data[p];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var types = [];
		var activities = [];
		timestamps = [];
		

		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
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
				{
				types.push(type);

				
				type2 = activities[j][0].timestampMs;
			
			 		
				timestamps.push(type2);
					}
				}
			    
		
			
				var arraylength3 = timestamps.length;
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					
					if(tempDate.getHours() == 0)
						count0 = count0+1;
					else if(tempDate.getHours() == 1)
						count1 = count1+1;
					else if(tempDate.getHours() == 2)
						count2 = count2+1;
					else if(tempDate.getHours() == 3)
						count3 = count3+1;
					else if(tempDate.getHours() == 4)
						count4 = count4+1;
					else if(tempDate.getHours() == 5)
						count5 = count5+1;
					else if(tempDate.getHours() == 6)
						count6 = count6+1;
					else if(tempDate.getHours() == 7)
						count7 = count7+1;
					else if(tempDate.getHours() == 8)
						count8 = count8+1;
					else if(tempDate.getHours() == 9)
						count9 = count9+1;
					else if(tempDate.getHours() == 10)
						count10 = count10+1;
					else if(tempDate.getHours() == 11)
						count11 = count11+1;
					else if(tempDate.getHours() == 12)
						count12 = count12+1;
					else if(tempDate.getHours() == 13)
						count13 = count13+1;
					else if(tempDate.getHours() == 14)
						count14 = count14+1;
					else if(tempDate.getHours() == 15)
						count15 = count15+1;
					else if(tempDate.getHours() == 16)
						count16= count16+1;
					else if(tempDate.getHours() == 17)
						count17 = count17+1;
					else if(tempDate.getHours() == 18)
						count18 = count18+1;
					else if(tempDate.getHours() == 19)
						count19 = count19+1;
					else if(tempDate.getHours() == 20)
						count20 = count20+1;
					else if(tempDate.getHours() == 21)
						count21 = count21+1;
					else if(tempDate.getHours() == 22)
						count22 = count22+1;
					else if(tempDate.getHours() == 23)
						count23 = count23+1;
					
				}
				
					
					//console.log(activities);
}				
				hours[0]= count0;
				hours[1]= count1;
				hours[2]= count2;
				hours[3]= count3;
				hours[4]= count4;
				hours[5]= count5;
				hours[6]= count6;
				hours[7]= count7;
				hours[8]= count8;
				hours[9]= count9;
				hours[10]= count10;
				hours[11]= count11;
				hours[12]= count12;
				hours[13]= count13;
				hours[14]= count14;
				hours[15]= count15;
				hours[16]= count16;
				hours[17]= count17;
				hours[18]= count18;
				hours[19]= count19;
				hours[20]= count20;
				hours[21]= count21;
				hours[22]= count22;
				hours[23]= count23;
				
					let finalGraphdata ={
    type: 'bar',
    data: {
        labels: ['1 π.μ.', '2 π.μ.', '3 π.μ.', '4 π.μ.', '5 π.μ.', '6 π.μ.', '7 π.μ.', '8 π.μ.', '9 π.μ.', '10 π.μ.', '11 π.μ.', '12 π.μ.', '1 μ.μ.', '2 μ.μ.', '3 μ.μ.', '4 μ.μ.', '5 μ.μ.', '6 μ.μ.', '7 μ.μ.', '8 μ.μ.', '9 μ.μ.', '10 μ.μ.', '11 μ.μ.', '12 μ.μ.',],
        datasets: [{
            label: 'Ποσοστό εγγραφών ανά ώρα',
            data: hours,
            backgroundColor: 'rgba(185, 214, 200, 1)',
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
}

		res.json(finalGraphdata);

})
});

app.get("/admin/apiMonth",function(req,res)
{	
		var months = [];
		var count0 = 0;
		var count1 = 0;
		var count2 = 0;
		var count3 = 0;
		var count4 = 0;
		var count5 = 0;
		var count6 = 0;
		var count7 = 0;
		var count8 = 0;
		var count9 = 0;
		var count10 = 0;
		var count11 = 0;
	userData.find({})
	.select('data -_id')
	.exec(function(err,data){
		
		
		
		var userDatalength= data.length;
		for(var p=0;p<userDatalength;p++)
		{
		var accessdata = data[p];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var graphData = [];
		var activities = [];
		timestamps = [];
		

		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
				activity = locs.activity;
				
			 	 if(activity){
			 	 	
			 		
				timestamps.push(locs.timestampMs);
				}
				
				}	
			
		
			
				var arraylength3 = timestamps.length;
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
				
					
					if(tempDate.getMonth() == 0)
						count0 = count0+1;
					else if(tempDate.getMonth() == 1)
						count1 = count1+1;
					else if(tempDate.getMonth() == 2)
						count2 = count2+1;
					else if(tempDate.getMonth() == 3)
						count3 = count3+1;
					else if(tempDate.getMonth() == 4)
						count4 = count4+1;
					else if(tempDate.getMonth() == 5)
						count5 = count5+1;
					else if(tempDate.getMonth() == 6)
						count6 = count6+1;
					else if(tempDate.getMonth() == 7)
						count7 = count7+1;
					else if(tempDate.getMonth() == 8)
						count8 = count8+1;
					else if(tempDate.getMonth() == 9)
						count9 = count9+1;
					else if(tempDate.getMonth() == 10)
						count10 = count10+1;
					else if(tempDate.getMonth() == 11)
						count11 = count11+1;
					
				}
				
					
					//console.log(activities);
}				
				months[0]= count0;
				months[1]= count1;
				months[2]= count2;
				months[3]= count3;
				months[4]= count4;
				months[5]= count5;
				months[6]= count6;
				months[7]= count7;
				months[8]= count8;
				months[9]= count9;
				months[10]= count10;
				months[11]= count11;
				
					let finalGraphdata ={
    type: 'line',
    data: {
        labels: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
        datasets: [{
            label: 'Ποσοστό εγγραφών ανά μήνα',
            data: months,
            backgroundColor: 'rgba(117, 215, 20, 0.88)',
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
}

		res.json(finalGraphdata);

})
});

app.get("/admin/apiDay",function(req,res)
{	
		
		
	userData.find({})
	.select('data -_id')
	.exec(function(err,data){
		
		var days = [];
		var count0 = 0;
		var count1 = 0;
		var count2 = 0;
		var count3 = 0;
		var count4 = 0;
		var count5 = 0;
		var count6 = 0;
		
		var userDatalength= data.length;
		
		for(var p=0;p<userDatalength;p++)
		{
		var accessdata = data[p];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var types = [];
		var activities = [];
		timestamps = [];
		

		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
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
				{
				types.push(type);

				
				type2 = activities[j][0].timestampMs;
			
			 		
				timestamps.push(type2);
					}
				}
			    
				

			
			
				var arraylength3 = timestamps.length;
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
					
					if(tempDate.getDay() == 0)
						count0 = count0+1;
					else if(tempDate.getDay() == 1)
						count1 = count1+1;
					else if(tempDate.getDay() == 2)
						count2 = count2+1;
					else if(tempDate.getDay() == 3)
						count3 = count3+1;
					else if(tempDate.getDay() == 4)
						count4 = count4+1;
					else if(tempDate.getDay() == 5)
						count5 = count5+1;
					else if(tempDate.getDay() == 6)
						count6 = count6+1;
					
					
				}
				
					
					//console.log(activities);
}				
				days[0]= count0;
				days[1]= count1;
				days[2]= count2;
				days[3]= count3;
				days[4]= count4;
				days[5]= count5;
				days[6]= count6;
				
					let finalGraphdata ={
    type: 'line',
    data: {
        labels: ['Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή'],
        datasets: [{
            label: 'Ποσοστό καταχωρήσεων ανά ημέρα',
            data: days,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(51, 233, 133, 0.5)',
                'rgba(2, 27, 14, 0.5)'
            ],
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
}

		res.json(finalGraphdata);

})
});

app.get("/admin/apiYear",function(req,res)
{	
		
		
	userData.find({})
	.select('data -_id')
	.exec(function(err,data){
		var years = [];
		var count2015 = 0;
		var count2016 = 0;
		var count2017 = 0;
		var count2018 = 0;
		var count2019 = 0;
		var count2020 = 0;
		
		
		
		var userDatalength= data.length;
		for(var p=0;p<userDatalength;p++)
		{
		var accessdata = data[p];
		var locations = accessdata.data;
		var arraylength = locations.length;
		var types = [];
		var activities = [];
		timestamps = [];
		

		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
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
				{
				types.push(type);

				
				type2 = activities[j][0].timestampMs;
			
			 		
				timestamps.push(type2);
					}
				}
			    
			
			
				var arraylength3 = timestamps.length;
				for(var k=0; k<arraylength3; k++)
				{
				
				var tempDate= new Date(+timestamps[k]);
					
					
					if(tempDate.getUTCFullYear() == 2015)
						count2015 = count2015+1;
					else if(tempDate.getUTCFullYear() == 2016)
						count2016 = count2016+1;
					else if(tempDate.getUTCFullYear() == 2017)
						count2017 = count2017+1;
					else if(tempDate.getUTCFullYear() == 2018)
						count2018 = count2018+1;
					else if(tempDate.getUTCFullYear() == 2019)
						count2019 = count2019+1;
					else if(tempDate.getUTCFullYear() == 2020)
						count2020 = count2020+1;
					
					
				}
				
					
}				
				years[0]= count2015;
				years[1]= count2016;
				years[2]= count2017;
				years[3]= count2018;
				years[4]= count2019;
				years[5]= count2020;
				
				
					let finalGraphdata ={
    type: 'pie',
    data: {
        labels: [ '2015', '2016', '2017', '2018', '2019', '2020'],
        datasets: [{
            label: 'Ποσοστό εγγραφών ανά χρόνο',
            data: years,
                        backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(215, 20, 20, 1)',
                'rgba(0, 0, 0, 1)'

            ],
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
}

		res.json(finalGraphdata);

})
});

app.get("/admin/apiUsers",function(req,res)
{	

	userData.find({})
	.select('data username -_id')
	.exec(function(err,data){
		
		
		var namesData=[];
		var graphData = [];
		var userDatalength= data.length;
		

		for(var p=0;p<userDatalength;p++)
		{
			var types = [];	
		var activities = [];
		var accessdata = data[p];
		var locations = accessdata.data;
		var names= accessdata.username;
		 namesData.push(names);
		var arraylength = locations.length;
		

		for(var i=0; i<arraylength; i++)
		{
				
			var locs = locations[i] ; 
			
			
			
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
				
				var userNumOfData= types.length;
					graphData[p]=userNumOfData;
					
				}
					
				 
					let finalGraphdata ={
    type: 'bar',
    data: {
        labels: namesData,
        datasets: [{
            label: 'Ποσοστό ανά Χρήστη',
            data: graphData,
             backgroundColor: 'rgba(235, 228, 36, 1)',
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
}
		res.json(finalGraphdata);

})
});


app.get("/admin/api",function (req,res) {



User.find({}).select('data -_id').exec(function(err,data){
	let datat = [];
	if(data)
	{
	userData.find({})
	.select('data -_id')
	.exec(function(err,data){

		var startDate = Date.parse(confDates[0]);
		
		var endDate = Date.parse(confDates[1]);
		
		var userDatalength = data.length;
		for(var p = 0; p < userDatalength; p++)
		{
		var loc=data[p];
		var datas = JSON.stringify(loc);
		var datas2 = JSON.parse(datas);
		var mesa =datas2.data;
		var locs= mesa;
		var arraylength=locs.length;
		
			
		if(isNaN(startDate)== false)
		 {
		 	let latitudes = [];
		let longitudes = [];
		 	
			for(var i=0; i<arraylength;i++){
				
				tempDate = new Date(+locs[i].timestampMs);
				tempDate2 = new Date(+startDate);
				tempDate3 = new Date (+endDate);
				//console.log(tempDate2.getUTCFullYear() ,tempDate.getUTCFullYear() , tempDate3.getUTCFullYear());
			if(tempDate.getUTCFullYear()>=tempDate2.getUTCFullYear() && tempDate.getUTCFullYear() <= tempDate3.getUTCFullYear())
			{
				
			var latitude = locs[i].latitudeE7;
			if(latitude)
			latitudes.push(latitude/10000000);
			}
			else
				latitudes.push(0);
		}


		for(var i=0; i<arraylength;i++){
			tempDate = new Date(+locs[i].timestampMs);
				tempDate2 = new Date(+startDate);
				tempDate3 = new Date (+endDate);
			if(tempDate.getUTCFullYear()>=tempDate2.getUTCFullYear() && tempDate.getMonth() <= tempDate3.getMonth() && tempDate.getMonth()>=tempDate2.getMonth() && tempDate.getMonth() <= tempDate3.getMonth() && tempDate.getDay()>=tempDate2.getDay() && tempDate.getDay() <= tempDate3.getDay() && tempDate.getHours()>=tempDate2.getHours() && tempDate.getHours() <= tempDate3.getHours())
			{
				var longitude= locs[i].longitudeE7;

				if(longitude)
			longitudes.push(longitude/10000000);
			}
			else
				longitudes.push(0);
		}

		for(var i=0; i<arraylength;i++){
			
			var o1 ={lat: latitudes[i],lng: longitudes[i],count :1};

			datat.push(o1);
		
		}
			
		}
		else{
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
		
		for(var i=0; i<arraylength;i++){
			var o1 ={lat: latitudes[i],lng: longitudes[i],count :1};

			datat.push(o1);
		}
	}

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
}
});
	
});

app.get("/Register",function(req,res){
	res.render("Register");
});






app.listen(3000,function (){
	console.log("Server is Running at port 3000");	
});