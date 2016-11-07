var ejs= require('ejs');
//var mysql = require('mysql');
var encryption = require('./encryption');
var winston= require('winston');
var config= require('./config');
var poolConfig= config.dbpool;
var pool =[];
var db=config.db;
var sess;
function getConnection(){
	var connection= mysql.createConnection({
	    host     : db.host,
	    user     : db.user,
	    password : db.password,
	    database : db.database,
	    port	 : db.port
	});
	return connection;
}

exports.createConnectionPool= function createConnectionPool(){
	for(var i=0; i<poolConfig.maxsize;i++){
		pool.push(getConnection());
		//console.log(pool);
	}
};

exports.getcartdata= function(req,res){   //checked
	sess = req.session;
	if(sess.email){
		//var connection=getConnectionFromPool();
		var connection=getConnection();
		connection.query('select * from cart where email = "'+ req.session.email +'"', function(err, rows){
			var data={userlist:rows};
			pool.push(connection);
			console.log("this is the rows from cart:"+ JSON.stringify(rows));
			
			res.send(data);
		});
	}
	else{
		res.render('signin');
	}
};

exports.checkoutdata = function(req,res){ //checked
	sess=req.session;
	if(sess.email){
		//var connection=getConnectionFromPool();
		var connection=getConnection();
		winston.log('info','Clicked on Proceed to cart');
		var cartdata = req.body.cartdata;
		connection.query('delete from cart where email="' + req.session.email +'"');
		for(var i=0;i<cartdata.length;i++){
			var data = {
					email: cartdata[i].email,
					itemid: cartdata[i].itemid,
					itemname: cartdata[i].itemname,
					itemdescription: cartdata[i].itemdescription,
					itemprice: cartdata[i].itemprice,
					itemquantity: cartdata[i].itemquantity,
					quantityneeded:cartdata[i].quantityneeded
					};
			console.log("checking the variables of data:---" + JSON.stringify(data));
			connection.query("insert into cart set ?", data);
		}
		//pool.push(connection);
		res.send("hi");
	}
	else{
		res.render('signin');
	}
};

exports.checkoutdisplay=function(req,res){  //checked
	sess=req.session;
	if(sess.email){
		//var connection= getConnectionFromPool();
		var connection=getConnection();
		connection.query('select * from cart where email="'+ req.session.email+'"',function(error,rows1){
			connection.query('select * from userinfo where email= "' + req.session.email + '"', function(error,rows2){
				var data1={itemlist:rows1};
				console.log(data1);
				var data2={user:rows2};
				console.log(data2);
				var data={itemlist:rows1,user:rows2};
				//pool.push(connection);
				res.send(data);
			});
		});
	}
	else{
		res.render('signin');
	}
};

exports.complete = function(req,res){			//checked
	sess=req.session;
	if(sess.email){
		//var connection=getConnectionFromPool();
		var connection=getConnection();
		connection.query('select * from cart where email = "'+ req.session.email +'"',function(err,rows){
			console.log("This is current cart status" + JSON.stringify(rows));
			for(var i=0;i<rows.length;i++){
				var data={
					email:rows[i].email,
					itemid:rows[i].itemid,
					itemname:rows[i].itemname,
					quantity:rows[i].quantityneeded,
					itemprice:rows[i].itemprice
				};
				connection.query('insert into purchasehistory set ?',data);
				connection.query('delete from cart where email="'+req.session.email + '"');
				var query = 'update product_to_sell set productquantity =' +
				'greatest(0,productquantity-' + rows[i].quantityneeded+') where '+
				'productid="'+rows[i].itemid+'"';
						connection.query(query,function(error,row){
							
				});
			}
			//pool.push(connection);
		});
		winston.log('info', ''+req.session.email +' completed transaction');
		res.render('transactioncomplete',{name:req.session.firstname});
	}
	else{
		res.render('signin');
	}
};

exports.loadcarddetails=function(req,res){     //checked
	sess=req.session;
	if(sess.email){
		//var connection= getConnectionFromPool();
		var connection=getConnection();
		var data;
		winston.log('info', ''+req.session.email +' credit card Details loading');
		
		connection.query("select * from creditcard as C ,userinfo as U where U.email=C.email and C.email='" + req.session.email +"'", function(error, rows){
			if(rows.length>0){
				console.log("This is the data for load card details:" + JSON.stringify(rows));
				data={card:rows};
				//pool.push(connection);
				res.send(data);
			}
			else{
				data="Enter credit card details";
				//pool.push(connection);
				res.send(data);
			}	
		});
	}
	else{
		res.render('signin');
	}
};

exports.addcarddetails= function(req,res){			//checked
	sess=req.session;
	if(sess.email){
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
		//var connection=getConnectionFromPool();
		var connection=getConnection();
			if(value1 && value2 && value3){
			connection.query('insert into creditcard set ?',data);
			winston.log('info', ''+req.session.email +' Credit card Details added');
			//pool.push(connection);
			console.log(data);	
			res.send({msg:"successful"});
			}
			else{
				msg="Wrong Credit card information";
				res.send({msg: msg});
			}
	}
	
	else{
		res.render('signin');
	}
};


exports.profile = function(req, res){      //checked
	sess=req.session;
	if (sess.email){
	var connection=getConnection();
	//winston.log('info', ''+req.session.email +' viewed profile');
	winston.log('info', ''+req.session.email +' Visited Profile');
	connection.query('select * from userinfo where email = "'+ req.session.email +'"', function(err, rows1){
		connection.query('select * from product_to_sell where email = "'+ req.session.email +'"', function(err, rows2){
			connection.query('select * from bidding_product_to_sell where email = "'+ req.session.email +'"', function(err, rows3){
				connection.query('select * from purchasehistory where email = "'+ req.session.email +'"', function(err, rows4){
					var data1 = {productlist: rows2};
					console.log(data1);
					var data2 = {userlist: rows1};
					console.log(data2);
					var data3 = {bidlist: rows3};
					console.log(data3);
					var data4 = {list: rows4};
					console.log(data4);
					res.render('profile', {name: req.session.firstname, bidlist: rows3, productlist: rows2, userlist: rows1, list: rows4 });
			});
		});
	});
	});
	}
	else{
		res.redirect("/login");
	}
};




exports.getdata= function(req,res){ // checked
	sess=req.session;
	if(sess.email){
	//var connection=getConnectionFromPool();
		var connection=getConnection();
		
	connection.query('select * from product_to_sell as A, userinfo as B where A.category = "Women\'s Clothing" and A.email=B.email and B.email<>"'+ req.session.email +'"', function(err, rows){
		var data = {productlist: rows};
		//pool.push(connection);
		console.log("from women clothing");
		console.log(JSON.stringify(data));
		res.send(data);
		});
	}
	else{
		res.render('signin');
	}
};

exports.addtocart= function(req,res){ //checked
	sess=req.session;
	if(sess.email){
		winston.log('info', ''+req.session.email +' added item to cart');
		//var connection= getConnectionFromPool();
		var connection=getConnection();
		console.log(JSON.stringify(req.body));
		var productid = req.body.items.productid;
		var productname=req.body.items.productname;
		var productdescription = req.body.items.productdescription;
		var productquantity = req.body.items.productquantity;
		var productprice = req.body.items.productprice;
		//console.log(JSON.stringify(req.body.productprice));
		var data = {
					email: sess.email,
					itemid: productid,
					itemname:productname,
					itemdescription:productdescription,
					itemprice:productprice,
					itemquantity:productquantity
				};
		connection.query("insert into cart set ?", data);
		//pool.push(connection);
		res.send('womenclothing');
	}
	else{
		res.render('signin');
	}
};




//fetching the data from the sql server
exports.fetchdata=function(callback,sqlQuery){			//checked
	//var connection=getConnectionFromPool();
	var connection=getConnection();
	console.log("connection created");
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: ", err.message);
			//pool.push(connection);
		}
		else
		{ // return err or result
			console.log("DB Results:", rows);
			//pool.push(connection);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	//connection.end();
};



exports.register=function(req, res){  			//checked
		//var connection=getConnectionFromPool();
	var connection=getConnection();
	winston.log('info', ''+req.session.email +' register process called');
	console.log("This is after /register api call:" + JSON.stringify(req.body));
		var email=req.body.email;
		var password = req.body.password;
		var encrypted_password = encryption.encrypt(password);
		var sess= req.session;
		var data = {email: req.body.email,
					firstname: req.body.firstname,
					lastname: req.body.lastname,
					password: encrypted_password,
					birthday: "1992-12-12",
					address: 'San Jose',
					contactno: req.body.mobile
					};
		connection.query("insert into userinfo set ?", data, function(err,rows){
			if(!err){
				req.session.firstname=data.firstname;  //for displaying hi "name" on homepage
				res.send({status:200, firstname: req.session.firstname});
			}
			else{
				res.send({status:400});
			}
		});
		//pool.push(connection);
		
		//connection.end();
	
};

exports.deleteproduct = function(req,res){  			//check
	sess=req.session;
	if(sess.email){
    var productname = req.params.productname;   
    winston.log('info', ''+req.session.email +' deleted item');
    var connection =getConnection();
       connection.query("DELETE FROM product_to_sell  WHERE productname = ? ",[productname], function(err, rows)
       {
            if(err){
                console.log("Error deleting : %s ",err );
            }
            res.redirect('back');
       });
	}
	else{
		res.render('signin');
	}
};
function womenclothingauction(req, res){
	var connection=getConnection();
	winston.log('info', ''+req.session.email +' navigated to Women Category');
	//winston.log('info', ''+req.session.email+'viewed women clothing');
	connection.query('select *,DATE_ADD(biddateposted,INTERVAL 4 DAY) AS BidCloses from bidding_product_to_sell where bidcategory = "Women\'s Clothing" AND email <> "'+req.session.email+'"', function(err, rows){
		var data = {productlist: rows, name:req.session.firstname};
		//winston.log('info','ho gaya'+JSON.stringify(data));
		//console.log("maayaaa"+JSON.stringify(data));
		res.render('womenclothingauction', data);
	});
}
exports.womenclothingauction=womenclothingauction;

function postbid(req, res){
	var sess=req.session;
	if(sess.email){
	var connection=getConnection();
	winston.log('info', ''+req.session.email +' wants to bid ');
	console.log("hi" + JSON.stringify(req.body));
	var email = req.session.email;
	var bidvalue = req.body.bidvalue;
	var data = {email: req.session.email,
				bidvalue: req.body.bidvalue,
				bidproductid: req.body.bidproductid,
				};
	//winston.log('info', ''+req.session.email+'bids for the product'+JSON.stringify(req.body.bidproductid)+'');
	connection.query('select bidvalue from bidding_product_to_sell where bidproductid ="'+ req.body.bidproductid+'"', function(err, rows){
		var value={values:rows};
	console.log("value " +JSON.stringify(value.values[0].bidvalue));
	if(req.body.bidvalue > value.values[0].bidvalue){
		console.log("aaya idhar");
		connection.query('update bidding_product_to_sell set bidtakenby= "'+ req.session.email +'", bidvalue= "'+req.body.bidvalue+'" where bidproductid= "'+req.body.bidproductid+'"');
		console.log(data);
		console.log("ho gaya");
		res.redirect('back');
		connection.end();
	}
	else{
		console.log("ni hua");
		res.redirect('back');
	}
	});
	}
	else{
		res.redirect("/login");
	}
}
exports.postbid=postbid;

exports.savebidproduct=function(req, res){			//checked
	sess= req.session;
	if(sess.email){
		var connection=getConnection();
		winston.log('info', ''+req.session.email +' saved a new product for bidding');
		//var connection=getConnectionFromPool();
		console.log("hi mansi hello" +req.session.email);
		var data = {
				email: req.session.email,
				bidproductid: req.body.productid,
				bidproductname: req.body.productname,
				bidproductdescription: req.body.productdescription,
				bidproductprice: req.body.productprice,
				bidtakenby: req.session.email,
				bidcategory: req.body.category
			};
		connection.query('insert into bidding_product_to_sell set ?', data);
		//pool.push(connection);
		res.redirect('/profile');
	}
	else{
		res.redirect("/login");
	}
};
exports.deletebidproduct = function(req,res){  
	var sess= req.session;
	if(sess.email){
		console.log("from delete product from mysql");
		winston.log('info', ''+req.session.email +' deleted bid item');
		console.log(JSON.stringify(req.body));
    var itemid = req.params.bidproductid;
    console.log(itemid);
    console.log(req.session.email);
    var connection =getConnection();
       connection.query("DELETE FROM bidding_product_to_sell WHERE bidproductid = '"+req.params.bidproductid+"' and email= '"+req.session.email+"'", function(err, rows)
       {
            if(err){
                console.log("Error deleting : %s ",err );
            }
            res.redirect('/profile');
            //winston.log('info',''+ req.session.email +' deleted '+req.params.bidproductid+' from bid products');
       });
	}
	else{
		res.redirect('/login');
	}
};

exports.saveproduct=function(req, res){	//checked
	sess= req.session;
	if(sess.email){
		winston.log('info', ''+req.session.email +' saved a new product to sell');
		
		console.log("hi mansi hello" +req.session.email);
		var data = {
				email: req.session.email ,
				productid: req.body.productid, 
				productname: req.body.productname,
				productdescription: req.body.productdescription,
				productprice: req.body.productprice,
				productquantity: req.body.productquantity, 
				category: req.body.category
			};
		var connection=getConnection();
		//var connection=getConnectionFromPool();
		connection.query('insert into product_to_sell set ?', data);
		//pool.push(connection);
		res.redirect('/profile');
	}
	else{
		res.redirect("/login");
	}
};