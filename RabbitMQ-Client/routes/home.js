var ejs = require("ejs");
var mq_client = require('../rpc/client');
var session= require("express-session");
function sign_in(req,res) {
	ejs.renderFile('./views/signin.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

function after_sign_in(req,res)
{
	// check user already exists
	//var getUser="select * from users where emailid='"+req.param("username")+"'";
	var username = req.param("username");
	var password = req.param("password");
	var msg_payload = { "username": username, "password": password };
		
	console.log("In POST Request = UserName:"+ username+" "+password);
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		console.log(results);
		console.log(results.data);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				req.session.username = results.data.username;
				req.session.age = results.data.age;
				//req.session.username = results.data.username;
				res.send({"login":"Success", data:results.data});
			}
			else {    
				console.log("Invalid Login");
				res.send({"login from home.js":"Fail"});
			}
		}  
	});
}

function register(req,res)
{
	// check user already exists
	//var getUser="select * from users where emailid='"+req.param("username")+"'";
	var username = req.param("username");
	var password = req.param("password");
	var age = req.param("age");
	var msg_payload = { "username": username, "password": password, "age": age };
		
	console.log("In POST Request = UserName:"+ username+" "+password);
	
	mq_client.make_request('register_queue',msg_payload, function(err,results){
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("Registered");
				res.send({"Registration":"Success", data:results.data});
			}
			else {    
				console.log("Invalid registration");
				res.send({"registration":"Fail"});
			}
		}  
	});
}

function success_login(req,res)
{
	ejs.renderFile('./views/success_login.ejs',{"username": req.session.username, "age": req.session.age}, function(err, result) {
        // render on success
        if (!err) {
            res.send(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}


function fail_login(req,res)
{
	ejs.renderFile('./views/fail_login.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}

exports.sign_in=sign_in;
exports.after_sign_in=after_sign_in;
exports.register=register;
exports.success_login=success_login;
exports.fail_login=fail_login;