var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

function women_request(msg, callback){		
	console.log("in womenGetData_request"+ req.session.email);
	mongo.connect(mongoURL, function(){
		var coll = mongo.collection('products');
		coll.find({"email":{$ne:req.session.email}, "category":"Women", "bidding":"no"}).toArray(function(err,cursors){
			var data = [];
			var count = cursors.length;
			var index = 0;
			cursors.forEach(function(product){
				if(product)
					{
						data.push(product);
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
exports.women_request = women_request;