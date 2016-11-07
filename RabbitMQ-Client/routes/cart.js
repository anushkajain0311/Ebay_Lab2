var winston= require('winston');
var sess;

exports.cart =function(req, res){
	sess=req.session;
	if(sess.email){
		winston.log('info', ''+req.session.email +' navigating to cart');
		res.render('cart',{name:req.session.firstname});
	}
	else{
		res.render('signin');
	}
};