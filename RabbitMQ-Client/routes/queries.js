var ejs = require("ejs");
var mq_client = require('../rpc/client');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var encryption = require('./encryption');
var sess;
var passport = require('passport');
require('./passport')(passport);

exports.afterLogin=function(req,res,next){
	sess= req.session;
	var email = req.param("username");
	var password = req.param("password");
	var encrypted_password = encryption.encrypt(password);
	passport.authenticate('/afterlogin',
	mq_client.make_request('login_queue',{"email": email, "password": encrypted_password}, function(err,results){
			console.log(results);
			console.log(results.code);
			if(err){
				throw err;
			}
			else 
			{
				if(results.code == 200){
					console.log("valid Login");
					req.session.email = results.data.email;
					req.session.firstName = results.data.firstName;
					req.session.lastName = results.data.lastName;
					req.session.address = results.data.address;
					console.log(req.session.email);
					res.send({status:200});
					winston.log('info',"Successfully signed in");
				}
				else {    
					console.log("Invalid Login");
				}
			}  
		}));
};
	
exports.register= function(req,res){
	winston.log('info', ''+req.session.email +' register process called');
	console.log("This is after /register api call:" + JSON.stringify(req.body));
		var email=req.body.email;
		var password = req.body.password;
		var firstName = req.body.firstname;
		var lastName= req.body.lastname;
		var phone = req.body.mobile;
		var encrypted_password = encryption.encrypt(password);
		var msg_payload1 = { "email": email, "password": encrypted_password, "firstName": firstName, "lastName": lastName, "phone":phone };
		mq_client.make_request('register_queue',msg_payload1, function(err,results){
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				if(results.code == 400){
					console.log("user already exists");
					winston.log('info',"user already exists");
					res.send({status:400});
				}
				else if(results.code == 200){
					console.log("Register successful");
					winston.log('info',"Register successful");
					res.send({status:200, firstname: req.session.firstname});
				}
				else {    
					winston.log('info',"Invalid registration");
					res.send({"registration":"Fail"});
				}
			}  
		});
};

exports.getdata= function(req,res){
	var msg_payload = { "email": req.session.email, "category": "Women", "bidding": "no"};
	mq_client.make_request('women_queue',msg_payload, function(err,results){
		console.log("response from server in getdatafunction is "+results);
		if(result.code==00){
			res.send("No Products to display");
		}
		else if(result.code==200) {
			res.send("result");
		}
		else{
			throw err;
		}
	});
};
	
exports.addtocart= function(req,res){ 
		console.log(JSON.stringify(req.body));
		var productid = req.body.items.productId;
		var productname=req.body.items.productName;
		var productdescription = req.body.items.productDescription;
		var productquantity = req.body.items.productQuantity;
		var productprice = req.body.items.productprice;
		var msg_payload={ "productid": productid, "productname": productname, "productdescription": productdescription, 
				"productquantity": productquantity, "productprice":productprice };
		mq_client.make_request('addToCart_queue',msg_payload, function(err,results){
			console.log(results);
			console.log(results.data);
			if(results.code == 200){
				console.log("Added to cart successful");
				res.send({status:200});
				}
			else{
				console.log("Could not add item to cart");
				res.send({status:401});
			}
		});
};

exports.getcartdata= function(req,res){   
	var msg_payload={ "email": req.body.email};
	mq_client.make_request('cartDetails_queue',msg_payload, function(err,results){
		console.log(results);
		if(results.code == 200){
			console.log("Received Cart Details");
			res.send({status:200, data: results.d});
			}
		else{
			console.log("Could not view cart");
			res.send({status:401});
		}
	});
};

exports.postbid= function(req,res){   
	var msg_payload={ "email": req.body.email, "bidvalue":req.body.bidvalue, "productId":req.body.productid};
	mq_client.make_request('bid_queue',msg_payload, function(err,results){
		console.log(results);
		if(results.code == 200){
			console.log("Bidding Done Successfully");
			res.send({status:200});
			}
		else{
			console.log("Not the highest bid value");
			res.send({status:401});
		}
	});
};

exports.checkoutdata = function(req,res){ 
		var cartdata = req.body.cartdata;
		console.log(JSON.stringify(cartdata));
		mq_client.make_request('checkout_queue',msg_payload, function(err,results){
			console.log(results);
			if(results.code == 200){
				console.log("Checkout Data");
				res.send({status:200, data: results.d});
				}
			else{
				console.log("Error in checkout");
				res.send({status:401});
			}
		});
};

exports.addcarddetails= function(req,res){			
	console.log("This is complete function call:");
	 data=req.body;
		var cardnumber= data.cardnumber;
		var date=data.expirationdate;
		var cvv= data.securitycode;
		console.log("I m in add card details ");
		var value1=/^([1-9]{1}[0-9]{15})$/.test(number);
		var value2=/^(20)([1][789]|[2-9]\d)[- /.](0[1-9]|1[012])$/.test(date);
		var value3=/^([1-9]{1}[0-9]{2})$/.test(cvv);
		var msg=" ";
		var msg_payload={
			email:req.session.email,
			cardnumber:cardnumber,
			date:date,
			cvv:cvv,
			value1:value1,
			value2:value2,
			value3:value3
		};

	mq_client.make_request('card_queue',msg_payload, function(err,results){
		console.log(results);
		console.log(results.data);
		if(results.code == 200){
			res.send({status:200, msg: results.data});
			}
		else{
			msg="Wrong Credit card information";
			res.send({msg: msg});
		}
	});
};

exports.complete = function(req,res){			
	console.log("This is complete function call:");
	mq_client.make_request('complete_queue',{"email": "ebay@gmail.com"}, function(err,results){
		console.log(results);
		console.log(results.data);
		if(results.code == 200){
			res.send({status:200, data: results.data});
			}
		else{
			throw err;
		}
	});
};

exports.profile = function(req, res){   
	console.log("This is profile function call:");
	mq_client.make_request('profile_queue',{"email": "ebay@gmail.com"}, function(err,results){
		console.log(results);
		console.log(results.data);
		if(results.code == 200){
				console.log("status 200 gotcha");
				res.send({status:200, user: results.data});
			}
		else{
			throw err;
		}
	});
};