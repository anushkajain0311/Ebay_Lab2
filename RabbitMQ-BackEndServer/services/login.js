var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

function handle_request(msg, callback){
	var email = msg.email;
	var password = msg.password;
	var res = {};
	console.log("In handle request:"+ msg.email);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		coll.findOne({"email": email, "password":password}, function(err, user){
		if (user) {
			res.code = "200";
			res.value = "Succes Login from login.js";	
			res.data = user;
			}
		else{
			res.code = "401";
			res.value = "Failed Login from login.js";
			}
		callback(null, res);
		});	
	});
}
exports.handle_request = handle_request;

function register_request(msg, callback){	
	var email = msg.email;
	var password = msg.password;
	var firstName = msg.firstName;
	var lastName = msg.lastName;
	var phone = msg.phone;
	var res = {};
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('users');
		coll.findOne({"email":email}, function(err, user){
			if(user){
				res.code = "400";
			}
			else{
				coll.insert({"email": email,"firstName": firstName,"lastName": lastName,"password": password,"phone": phone,
					"address":"","dateofBirth":"","product_to_sell":[],"card":{"cardnumber":"","date":"","cvv":""},
					"cart":[],"purchaseHistory":[]}, function(err,rows){
					if(!err){
						console.log("Register successful");
						res.code = "200";
						res.value = "Succes Registration from login.js";
					}
					else{
						res.code = "401";
						res.value = "Failed Registration from login.js";
					}
					callback(null, res);
				});	
		}	
	});
	});	
};
exports.register_request = register_request;