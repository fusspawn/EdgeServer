(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var sockets = require("./socketclient.js");
var socket = new sockets();

socket.handlers["gameserver.connection"] = function (data) {
    console.log("GameServerConnectionChanged - New Status: ", data.message);
};

setInterval(function () {
    socket.send_message({
        path: "testpath",
        message: "test_message"
    });
}, 1000 / 50);
},{"./socketclient.js":2}],2:[function(require,module,exports){
function SocketClient(host)
{
    this.socket = io.connect(host);
    this.id = null;
    this.handlers = {};
    this.last_send = null;
    this.messageid = 0;

    var that = this;

    this.socket.on("setid", function (data) {
        that.id = data.id;
        console.log("ConnectionID set: " + that.id.toString());
    });

    this.socket.on("packet", function (data) {
        console.log(data);
        if (that.handlers[data.path])
            that.handlers[data.path](data);
    });

    this.send_message = function (message)
    {
        if (that.id == null) {
            console.log("SocketClient.send_message called with no connection id set. Ignoring packet");
            return;
        }

        if (typeof message.id === 'undefined')
            message.senderid == that.id;

        that.socket.emit("packet", message); 
    }
};

module.exports = SocketClient;
},{}]},{},[1])