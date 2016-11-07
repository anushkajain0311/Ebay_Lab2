/**
 * New node file
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";


function bid_request(msg, callback){		
	console.log("in bid.js file");
	mongo.connect(mongoURL, function(){
		var productId = msg.productid;
		var email = msg.email;
		var bidvalue = msg.bidvalue;
		var coll= mongo.collection('products');
		coll.findOne({"productId": productId}, function(err, product){
			if(product){
				coll.update({"bidtakenby":email}, {$set : {"bidvalue": bidvalue}});
				res.code = "200";
			}
			else{
				res.code = "400";
			}
		});	
	});
}
exports.bid_request = bid_request;