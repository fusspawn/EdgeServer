
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var redis = require("redis");
var app = express();
var socket_cache = {};
var redis_client = redis.createClient(6379, "evedata.cloudapp.net");
    redis_client.on("error", function (err) {
        console.log("Redis Error: " + err);
    });
    redis_client.auth("trasher03!", function (err, response) {
        if (err)
            throw new err;
        else
            console.log(response);
    });



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var httpserver = http.createServer(app);
io = require('socket.io').listen(httpserver);
io.sockets.on('connection', function (socket) {
    redis_client.incr("networkconfig.connectionID", function (err, reply) {
        socket.set("connectionID", reply);
        socket.emit("setid", { id: reply });
        socket_cache[reply] = socket;
    });

    socket.on('packet', function (data) {
        socket.emit('packet', data);
    });
});

httpserver.listen(app.get('port'), function () {
    console.log('Frontend server listening on port ' + app.get('port'));
});

