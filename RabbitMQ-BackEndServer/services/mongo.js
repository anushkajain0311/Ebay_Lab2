var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var poolConfig= 100;
var pool =[];

exports.createConnectionPool= function createConnectionPool(){
	for(var i=0; i<poolConfig.maxsize;i++){
		pool.push(connect("mongodb://localhost:27017/login",function(){
			return db;
		}));
	}
}

function getConnectionFromPool(){
	if(pool.length<=0){
		console.log("empty connection pool!");
		return null;
	}
	else{
		return pool.pop();
		
	}
	
}
/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
};