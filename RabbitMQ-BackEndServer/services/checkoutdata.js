/**
 * New node file
 */

function checkoutData_request(msg, callback){		
	console.log("in carddetails.js ");
	var email = msg.email;
	mongo.connect(mongoURL, function(){
			var coll=mongo.collection('users');
			coll.update({"email":email},{$set: {"cart":[]}});
			for(var i=0;i<cartdata.length;i++){
				coll.update({"email":email},
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
						console.log("Added to cart successful");
						res.code = "200";
					}					
				});	
			}
		});
}
exports.checkoutData_request = checkoutData_request;