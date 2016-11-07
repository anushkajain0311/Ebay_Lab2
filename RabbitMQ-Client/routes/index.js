var ejs = require("ejs");
var mysql = require('./mysql');
var encryption = require('./encryption');
var winston= require('winston');

var sess;
exports.index= function(req,res){			
	sess= req.session;
	if(sess.email){
		res.render('homepage1',{name:sess.firstname});
	}
	else{
		res.render('homepage');
	}
};

exports.homepage=function(req,res){			
	sess=req.session;
	if(sess.email){
		//winston.log('info',"Landed on homepage");
		
		res.render('homepage1',{name:sess.firstname});
	}
	else{
		res.render('signin'); 
	}
};

exports.signin= function(req,res) {	
	console.log("hi");
	res.render('signin');
	//winston.log('info',"Landed on signin");
};


exports.logout = function(req,res){			
	console.log(JSON.stringify(req.session.email));
	winston.log('info', ''+req.session.email +' logged out');
	req.session.destroy();
	res.render('homepage');
};