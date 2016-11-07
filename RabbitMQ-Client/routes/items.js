var ejs = require("ejs");
var winston= require('winston');

exports.profile= function(req,res) {
	winston.log('info', ''+req.session.email +' navigating to Profile');
	res.render('profile');
};
exports.womenclothing=function(req, res){
	sess=req.session;
	if(sess.email){
		winston.log('info', ''+req.session.email +' navigating to Women Category');
		res.render('womenclothing',{name:req.session.firstname});
	}
	else{
		res.render('signin');
	}
};

exports.menfootwear= function(req,res) {
	res.render('menfootwear');
};

exports.electronics= function(req,res) {
	res.render('electronics');
};

exports.sportinggoods= function(req,res) {
	res.render('sportinggoods');
};

exports.addbidproduct= function(req,res) {
	winston.log('info', ''+req.session.email +' navigated to add product form');
	res.render('addbidproduct',{name:req.session.firstname});
};
exports.addproduct= function(req,res) {
	if(sess.email){
		winston.log('info', ''+req.session.email +' navigated to add product for bidding form');
	
	res.render('addproduct',{name:req.session.firstname});
	}
};