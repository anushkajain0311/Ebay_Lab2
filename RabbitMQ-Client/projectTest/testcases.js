var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should return the homepage if the url is correct', function(done){
		http.get('http://localhost:3000/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('goes to homepage only when user is logged in', function(done){
		http.get('http://localhost:3000/homepage1', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
	it('testing signin url', function(done){
		request.post('http://localhost:3000/aftersignin',
				{form:{email:"anushka.jain1499@gmail.com",password:"anushka123"}}, function(error,response,body) {
			assert.equal(200, response.statusCode);
			done();
		})
	});
	
	it('will direct to cart', function(done){
		http.get('http://localhost:3000/cart', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	
	it('will direct to Women\'s Fashion', function(done){
		http.get('http://localhost:3000/womenclothing', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	
});