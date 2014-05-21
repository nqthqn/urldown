
var hapi = require('hapi');
var ansi = require('simple-ansi');
var redis = require('redis');
var options = {
	views: {
    engines: { html: 'handlebars'},
    path: __dirname + '/views',
    partialsPath: __dirname + '/views/partials',
    helpersPath: __dirname + '/views/helpers'
  }
};
var server_port = 80;
var server = new hapi.Server('0.0.0.0', server_port, options);
var redisClient  = redis.createClient(6379, "localhost");
var max_downloads = 5


// CONTROLLERS
function homepage(request, reply) {
	reply.view("index", {
		ip:request.raw.req.connection.remoteAddress
	});
}

function downloadable(request, reply) {
	redisClient.get(request.params.token,function(err, tokenval) {
  
		if(tokenval && tokenval < max_downloads){
			
			var options = {
				filename:'A-Letter.zip',
			}
			reply.file('./deliverables/letter.zip', options)
			// NOSQL!
			redisClient.incr(request.params.token);

		} else {
			reply.view("downloads", {
				max_downloads: max_downloads,
				css_status: 'red',
				token: request.params.token,
				tokenval: tokenval
			});
		}

	});
}

// ROUTES
server.route([
  {method: 'GET', path: '/', handler: homepage},
  {method: 'GET', path: '/d/{token}', handler: downloadable},

//{method: 'POST', path:'/d/', handler: downloadcreator}
	{ method: 'GET', path: '/bower_components/{jslib}', handler: { directory: { path: "./bower_components/"} }},
  { method: 'GET', path: '/scripts/{js}', handler: { directory: { path: "./scripts/"} }},
  { method: 'GET', path: '/css/{cssfile}', handler: { directory: { path: "./css/"} }},
  { method: 'GET', path: '/fonts/{cssfile}', handler: { directory: { path: "./fonts/"} }},
]);

// SERVER
server.start( function() {
  now = new Date();  
  console.log('['+ ansi.green + 'INFO' + ansi.reset + ']' + ' ' + now + ' Starting HAPI server at port: ' + ansi.blue + server_port + ansi.reset);
});
