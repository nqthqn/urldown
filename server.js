
// How you import js into js!
var hapi = require('hapi');
var test = require('./test')
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

function homepage(request, reply) {
	reply("Hi there! Nothing to see here, move along...");
}

function downloadable(request, reply) {
	// Check value of key in redis
	// If value < max_num_of_downloads_allowed proceed to access download
	// If value > max_num_of_downloads_allowed DEL key:value store
	// Hard Code

	redisClient.get(request.params.token,function(err, tokenval) {
  
		if(tokenval && tokenval < max_downloads){
			
			reply.file('./deliverables/letter.zip')
			redisClient.incr(request.params.token);
		} else {
			reply.view("index", {
				max_downloads: max_downloads,
				css_status: 'red',
				token: request.params.token,
				tokenval: tokenval
			});
		}

	});
}
server.route([
  {method: 'GET', path: '/', handler: homepage},
  {method: 'GET', path: '/d/{token}', handler: downloadable},

//{method: 'POST', path:'/d/', handler: downloadcreator}
	{method: 'GET', path: '/vendor/{jslib}', handler: { directory: { path: "./vendor/"} }},
  { method: 'GET', path: '/scripts/{js}', handler: { directory: { path: "./scripts/"} }},
  { method: 'GET', path: '/css/{cssfile}', handler: { directory: { path: "./css/"} }},
  { method: 'GET', path: '/fonts/{cssfile}', handler: { directory: { path: "./fonts/"} }},
]);

server.start( function() {
  now = new Date();  
  console.log('['+ ansi.green + 'INFO' + ansi.reset + ']' + ' ' + now + ' Starting HAPI server at port: ' + ansi.blue + server_port + ansi.reset);
});
