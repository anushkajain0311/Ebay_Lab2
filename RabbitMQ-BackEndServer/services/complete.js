/**
 * New node file
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

function complete_request(msg, callback){		
	console.log("in profile.js "+ req.session.email);
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
				res.code = "200";
				res.value = "Cart Updated";	
				res.data = user;
			}
			else
			{
				res.code = "400";
			}
		});
	});
}
exports.complete_request = complete_request;