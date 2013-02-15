
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , fs = require('fs')
  , http = require('http')
  , util = require('util')
  , Tuiter = require('tuiter')
  , keys = require('./keys.json')
  , osc = require('omgosc');;
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


//------------------------------------------------------------------------- OSC
var sender = new osc.UdpSender('127.0.0.1', 12345);
// var i = 0;
// setInterval(function() {
//   sender.send('/osc_data',
// 			  'sfiTFNI',
// 			  ['hello', Math.random(), i++, true, false, null, undefined]);
// }, 1000/10);

//------------------------------------------------------------------------- SOCKET & TUITER
var tu = new Tuiter(keys);

// var output = fs.createWriteStream(__dirname + '/output.txt');
// 40.747306,-74.007205
tu.filter({location: [{lat: -90, long: -180}, {lat: 90, long: 180}]}, function(stream){
// tu.filter({track: ['#iHateHowPeople'], stall_warnings:true}, function(stream){

	stream.on('tweet', function(data){
		console.log(data);
		sender.send( '/tweet', 'sfiTFNI', [data.text] );
	});

	stream.on("delete", function(data){
	});

	// Log errors
	stream.on("error", function(error){
		console.error( error );
	});
});


