/*var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var encryption = require('./encryption');
var sess;
var passport = require('passport');
require('./passport')(passport);

exports.afterLogin=function(req,res,next){
	sess= req.session;
	console.log("i came here");
	  passport.authenticate('ebay', function(err, user, info) {
		  console.log("inside queries.js passport.authenticate");
		  req.session.email = user.email;
		  sess.firstname = user.firstName;
		    if(err) { 
		    	console.log("if err");
		    	return next(err); 
		    }
		    if(!user) {
		    	console.log("if !user");
		    	return res.redirect('/');
		    }
		    req.logIn(user, {session:false}, function(err) {
		    	console.log("if req.logIn");
		      if(err) { 
		    	  console.log("if err");
		    	  return next(err); 
		      }
		      console.log("if no err");
		      sess.user = JSON.stringify(user);
		      console.log("user:" +JSON.stringify(user));
		      console.log("sess.user:" +sess.user);
		      return res.send({status:200});
		    });
		  })(req, res, next);
};
	
exports.register= function(req,res){
	//winston.log('info', ''+req.session.email +' register process called');
	console.log("This is after /register api call:" + JSON.stringify(req.body));
		var email=req.body.email;
		var password = req.body.password;
		var encrypted_password = encryption.encrypt(password);
		var sess= req.session;
		mongo.connect(mongoURL, function(){
			console.log("connected to mongo at:" + mongoURL);
			var coll = mongo.collection('users');
			coll.findOne({"email":email}, function(err, user){
				if(user){
					res.send({status:400});
				}
				else{
					coll.insert({"email": req.body.email,
						"firstName": req.body.firstname,
						"lastName": req.body.lastname,
						"password": encrypted_password,
						"phone": req.body.mobile,
						"address":"",
						"dateofBirth":"",
						"product_to_sell":[],
						"card":{
							"cardnumber":"",
							"date":"",
							"cvv":""
						},
						"cart":[],
						"purchaseHistory":[],						
						}, function(err,rows){
						if(!err){
							console.log("Register successful");
							res.send({status:200, firstname: req.session.firstname});
						}
						});	
				}
			});
		});
};

exports.getdata= function(req,res){ 
	//console.log("hi" + sess.email);
	mongo.connect(mongoURL, function(){
	var coll = mongo.collection('products');
		coll.find({"email":{$ne:req.session.email}, "category":"Women", "bidding":"no"}).toArray(function(err,cursors){
				var data = [];
				var count = cursors.length;
				var index = 0;
				//console.log("count "+count);
			cursors.forEach(function(product){
				if(product)
					{
						//var jsonDoc = JSON.stringify(product);
						data.push(product);
						//console.log(data);
						index ++;
					}
				if(index == count) {
					console.log(data);
					res.send({"result":data});
				}
			});
		});
	});
};

exports.addtocart= function(req,res){ 
		//winston.log('info', ''+req.session.email +' added item to cart');
		console.log(JSON.stringify(req.body));
		var productid = req.body.items.productId;
		var productname=req.body.items.productName;
		var productdescription = req.body.items.productDescription;
		var productquantity = req.body.items.productQuantity;
		var productprice = req.body.items.productprice;
		mongo.connect(mongoURL, function(){
			var coll = mongo.collection('users');
				coll.update({"email": sess.email},
						{$addToSet:
							{cart:{
								"productId":productid,
								"productName":productname,
								"productDescription":productdescription,
								"productQuantity":productquantity,
								"productprice":productprice}}					
					}, function(err,rows){
					if(!err){
						console.log("Added to cart successful");
						res.send({status:200, firstname: req.session.firstname});
					}
					});	
		});
};

exports.getcartdata= function(req,res){   
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('users');
		var coll1= mongo.collection('products');
		var data = [];
		var d=[];
		var flag=0; var index = 0;
		coll.findOne({"email":req.session.email}, function(err, result){
			console.log("this is result from user collection"+JSON.stringify(result.cart));
			result.cart.forEach(function(product){
				if(product){
					console.log(product.productId);
					data.push(product.productId);
					console.log(data);
				}
			});
			console.log("this is outside ---" + data[0]);
			data.forEach(function(item){
				//console.log(data[0].productId);
				flag++;
				console.log(item);
				coll1.find({"productId":item}).toArray(function(err,cursors){
					var count = cursors.length;
					console.log("this is value of count:" +count);
					cursors.forEach(function(product){
						if(product){
							d.push(product);
							index ++;
						}
						if(index == flag) {
							console.log(d);
							//flag=1;
							res.send(d);
						}
					});
				});
			});	
		});
	});
};

exports.checkoutdata = function(req,res){ 
		//winston.log('info','Clicked on Proceed to cart');
		var cartdata = req.body.cartdata;
		console.log(JSON.stringify(cartdata));
		mongo.connect(mongoURL, function(){
			var coll=mongo.collection('users');
			coll.update({"email":req.session.email},{$set: {"cart":[]}});
			for(var i=0;i<cartdata.length;i++){
				coll.update({"email": req.session.email},
						{$addToSet:
							{cart:{
								"productId": cartdata[i].productId,
								"productName": cartdata[i].productName,
								"productDescription": cartdata[i].productDescription,
								"productprice": cartdata[i].productprice,
								"productQuantity": cartdata[i].productQuantity,
								"quantityneeded":cartdata[i].quantityneeded
								}}					
					}, function(err,rows){
					if(!err){
						console.log("Added to cart successful after proceed to checkout");
					}					
				});	
			}
		});
		res.send({status:200, firstname: req.session.firstname});
};

exports.checkoutdisplay=function(req,res){  
	var data;
	mongo.connect(mongoURL, function(){
		var coll= mongo.collection('users');
		coll.findOne({"email":req.session.email},function(err,user){
			if(user){
				console.log("this is from checkout display");
				console.log(user.card.cardnumber);
				if(user.card.cardnumber == ""){
					console.log("true");
					data="Enter credit card details";
				}
				else{
					data ="Have details";
				}
				console.log(user);
				console.log(data);
				res.send({user:user, data:data});
			}
			else{
				console.log("error occured");
				res.send({"status": 400});
			}
		});
	});
};

exports.addcarddetails= function(req,res){			
		data=req.body;
		var number= data.cardnumber;
		var date=data.expirationdate;
		var cvv= data.securitycode;
		console.log("I m in add card details ");
		var value1=/^([1-9]{1}[0-9]{15})$/.test(number);
		var value2=/^(20)([1][789]|[2-9]\d)[- /.](0[1-9]|1[012])$/.test(date);
		var value3=/^([1-9]{1}[0-9]{2})$/.test(cvv);
		var msg=" ";
		var data={
			email:req.session.email,
			cardnumber:number,
			date:date,
			cvv:cvv
		};
		
		mongo.connect(mongoURL, function(){
			var coll = mongo.collection('users');
			if(value1 && value2 && value3){
				coll.update({"email":sess.email}, {$set:{"card":{"cardnumber":number,"date":date, "cvv":cvv}}});
				//winston.log('info', ''+req.session.email +' Credit card Details added');
				res.send({msg:"successful"});
			}
			else{
				msg="Wrong Credit card information";
				res.send({msg: msg});
			}
		});
};

exports.complete = function(req,res){			
	mongo.connect(mongoURL, function(){
		var data;
		var coll= mongo.collection('users');
		var coll1= mongo.collection('products');
		var count=0;
		coll.findOne({"email": req.session.email}, function (err, user){
			if(user){
				data = user.cart;
				console.log("This is value of data" + JSON.stringify(data));
				coll.update({"email":req.session.email}, {$set : {"purchaseHistory": data , "cart":[]}});
				data.forEach(function (product){
					console.log(product.productId);
					console.log(product.quantityneeded);
					coll1.update({"productId":product.productId}, {$inc : {productQuantity :(-1 * product.quantityneeded)}});
				});
				res.send("hi");
			}
			else
			{
				console.log("error");
			}
		});
	});
};

exports.profile = function(req, res){   
	mongo.connect(mongoURL, function(){
		console.log(req.url);
		var coll= mongo.collection('users');
		coll.findOne({"email": req.session.email}, function(err, user){
			if(user){
				console.log("this is result " + JSON.stringify(user));
				res.send("hi");
			}
			else{
				console.log("error");
			}
		});	
	});
};*/