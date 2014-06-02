
var redis = require('redis');
var max_downloads = 5
var redisClient  = redis.createClient(6379, "localhost");

exports.homepage = function (request, reply) {
	reply.view("index", {
		ip:request.raw.req.connection.remoteAddress
	});
};

exports.downloadable = function (request, reply) {
	redisClient.get(request.params.token,function(err, tokenval) {
			
  	// Does the key exist and have they exceeded max downloads? 
		if(tokenval && tokenval < max_downloads){
			var options = {
				filename:'A-Letter.zip',
			}
			reply.file('./deliverables/letter.zip', options)
			redisClient.incr(request.params.token);
		} 
		else 
		{
			reply.view("downloads", {
				max_downloads: max_downloads,
				css_status: 'red',
				token: request.params.token,
				tokenval: tokenval
			});
		}
	});
};
