
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , fs = require('fs')
  , http = require('http')
  , util = require('util')
  , Tuiter = require('tuiter')
  , keys = require('./keys.json');
  // , tl = require('teleportd').teleportd({ user_key: 'ad460c8ef5b09562d7fc1400513b836d' });

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

//------------------------------------------------------------------------- SERVER

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

process.on('uncaughtException', function(err){
  util.inspect(err);
});

//------------------------------------------------------------------------- SOCKET & TUITER

var io = require('socket.io').listen(server);

var tu = new Tuiter(keys);

// var output = fs.createWriteStream(__dirname + '/output.txt');

tu.filter({track: ['picture'], stall_warnings:true}, function(stream){

	stream.on('tweet', function(data){

		// console.log(data.entities);
		// console.log(data.entities.media[0].media_url);
		if ( data.entities.media != undefined ) {

			io.sockets.emit("tweet", {
				  image: data.entities.media[0].media_url + ":thumb"
				, screen_name: data.user.screen_name
				, text: data.text
				, pic: data.user.profile_image_url
			});
			
		}

	});

	stream.on("delete", function(data){
	});

	// Log errors
	stream.on("error", function(error){
		console.error( error );
	});
});


