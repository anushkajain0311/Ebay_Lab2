/**
 * Created by Vedang Jadhav on 4/16/16.
 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require('./db/mongo');
var loginDatabase = "mongodb://localhost:27017/login";
module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username, password, done) {
    	console.log("am i here?");
        mongo.connect(loginDatabase, function(connection) {
            var login = mongo.connectToCollection('login', connection);
            var whereParams = {
                email:username,
                password:password
            }
            process.nextTick(function(){
                login.findOne(whereParams, function(error, user) {
                    if(error) {
                        return done(err);
                    }
                    if(!user) {
                        return done(null, false);
                    }
                    if(user.password != password) {
                        done(null, false);
                    }
                    connection.close();
                    console.log("from passport.js"+user.username);
                    done(null, user);
                });
            });
        });
    }));
}