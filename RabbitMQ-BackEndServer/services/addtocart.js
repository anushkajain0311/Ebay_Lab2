/**
 * New node file
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

function addToCart_request(msg, callback){		
	console.log("in carddetails.js ");
	var email = msg.email;
	mongo.connect(mongoURL, function(){
			var coll = mongo.collection('users');
				coll.update({"email": email},
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
						res.code = "200";
					}
					});	
		});
}
exports.addToCart_request = addToCart_request;