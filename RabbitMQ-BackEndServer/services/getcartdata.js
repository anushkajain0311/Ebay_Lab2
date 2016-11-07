/**
 * New node file
 */

function cartDetails_request(msg, callback){
	mongo.connect(mongoURL, function(){
		var email = msg.email;
		var coll = mongo.collection('users');
		var coll1= mongo.collection('products');
		var data = [];
		var d=[];
		var flag=0;
		var index = 0;
		coll.findOne({"email":email}, function(err, result){
			result.cart.forEach(function(product){
				if(product){
					data.push(product.productId);
				}
			});
			data.forEach(function(item){
				flag++;
				coll1.find({"productId":item}).toArray(function(err,cursors){
					var count = cursors.length;
					cursors.forEach(function(product){
						if(product){
							d.push(product);
							index ++;
						}
						if(index == flag) {
							res.code=200;
							res.data = d;}
					});
				});
			});	
		});
	});
}
exports.cartDetails_request = cartDetails_request;