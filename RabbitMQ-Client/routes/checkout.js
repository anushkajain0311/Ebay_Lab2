var sess;
var winston= require('winston');
exports.checkout= function(req,res){
	sess=req.session;
	if(sess.email){
		winston.log('info', ''+req.session.email +' navigating to checkout');
		res.render('checkout',{name:req.session.firstname});
	}
	else{
		res.render('signin');
	}
};