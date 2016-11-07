/**
 * New node file
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

function handle_request(msg, callback){		
	console.log("in profile.js ");
	mongo.connect(mongoURL, function(){
		console.log(req.url);
		var coll= mongo.collection('users');
		coll.findOne({"email": email}, function(err, user){
			if(user){
				console.log("this is result " + JSON.stringify(user));
				res.code = "200";
				res.value = "going to profile.js";	
				res.data = user;
				callback(null, res);
			}
			else{
				console.log("error");
			}
		});	
	});
}
exports.handle_request = handle_request;