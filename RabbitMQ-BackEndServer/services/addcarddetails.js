/**
 * New node file
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

function cardDetails_request(msg, callback){		
	console.log("in carddetails.js ");
	var email = msg.email;
	var value1 = msg.value1;
	var value2 = msg.value2;
	var value3 = msg.value3;
	var cardnumber = msg.cardnumber;
	var date = msg.date;
	var cvv = msg.cvv;
	
		mongo.connect(mongoURL, function(){
			var coll = mongo.collection('users');
			if(value1 && value2 && value3){
				coll.update({"email":email}, {$set:{"card":{"cardnumber":cardnumber,"date":date, "cvv":cvv}}});
				//winston.log('info', ''+req.session.email +' Credit card Details added');
				res.code = "200";
				res.value = "added successfully";	
				res.data = user;
			}
			else{
				res.code = "401";
			}
		});
}
exports.cardDetails_request = cardDetails_request;