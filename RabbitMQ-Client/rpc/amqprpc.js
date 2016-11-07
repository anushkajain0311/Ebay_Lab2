var amqp = require('amqp')
  , crypto = require('crypto'); 
var TIMEOUT=15000;
var CONTENT_TYPE='application/json';
var CONTENT_ENCODING='utf-8';
var self;
 
exports = module.exports = AmqpRpc;
 
function AmqpRpc(connection){
  self = this;
  this.connection = connection; 
  this.requests = {};
  this.response_queue = false; 
}

AmqpRpc.prototype.makeRequest = function(queue_name, content, callback){
  console.log("in AmqpRpc.prototype.makeRequest");
  self = this;
  var correlationId = crypto.randomBytes(16).toString('hex');
  var tId = setTimeout(function(corr_id){
	  console.log("idhar h timeout");
	  callback(new Error("timeout " + corr_id));
	  delete self.requests[corr_id];
  }, TIMEOUT, correlationId);
  var entry = {
    callback:callback,
    timeout: tId 
  };
  self.requests[correlationId]=entry;
  self.setupResponseQueue(function(){
	  console.log("setting up response queue");
	  self.connection.publish(queue_name, content, {
		  correlationId:correlationId,
		  contentType:CONTENT_TYPE,
		  contentEncoding:CONTENT_ENCODING,
		  replyTo:self.response_queue});
  });
};
 
AmqpRpc.prototype.setupResponseQueue = function(next){
  console.log("in q.subscribe 1");
  if(this.response_queue) return next();
  self = this;
  self.connection.queue('', {exclusive:true}, function(q){ 
	console.log("in q.subscribe 2");
    self.response_queue = q.name;
    q.subscribe(function(message, headers, deliveryInfo, m){
    	console.log("in q.subscribe 3");
    	var correlationId = m.correlationId;
    	if(correlationId in self.requests){
    		console.log("in q.subscribe 4");
    		var entry = self.requests[correlationId];
    		clearTimeout(entry.timeout);
    		delete self.requests[correlationId];
    		entry.callback(null, message);
    	}
    });
    return next();    
  });
};