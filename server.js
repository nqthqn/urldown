
var hapi = require('hapi');
var handlers = require('./handlers');
var hapi_options = {

	views: {
    engines: { html: 'handlebars'},
    path: __dirname + '/views',
    partialsPath: __dirname + '/views/partials',
    helpersPath: __dirname + '/views/helpers'
  }
};
var ansi = require('simple-ansi');
var server_port = 80;
var server = new hapi.Server('0.0.0.0', server_port, hapi_options);

// APP

// HELPER FUNCTIONS
function slug(len){
	o = 'abcdefghejklmnopqrstuvwxyz1234567890';
	r = '';
	for(var i = 0; i < len; i++){
		r = r + o[Math.floor(Math.random()*100)%o.length]
	}
	return r;
}



// ROUTES
server.route([
//  {method: 'GET', path: '/b/{path*}', handler: { directory: { path: './bower_components', listing: false } }},
  {method: 'GET', path: '/', handler: handlers.homepage},
  {method: 'GET', path: '/d/{token}', handler: handlers.downloadable},

//  { method: 'POST', path:'/d/', handler: downloadcreator},
  { method: 'GET', path: '/scripts/{js}', handler: { directory: { path: "./scripts/"} }},
  { method: 'GET', path: '/css/{cssfile}', handler: { directory: { path: "./css/"} }},
  { method: 'GET', path: '/fonts/{cssfile}', handler: { directory: { path: "./fonts/"} }},
]);

// SERVER
server.start( function() {
  now = new Date();  
  console.log('['+ ansi.green + 'INFO' + ansi.reset + ']' + ' ' + now + ' Starting HAPI server at port: ' + ansi.blue + server_port + ansi.reset);
});
