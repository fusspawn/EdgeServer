var sockets = require("./socketclient.js");
var game_client = require("./gameclient.js");
var socket = new sockets();

socket.handlers["gameserver.connection"] = function (data) {
    console.log("GameServerConnectionChanged - New Status: ", data.message);
    game_client.start(socket);
};

setInterval(function () {
    socket.send_message({
        path: "testpath",
        message: "test_message"
    });
}, 1000 / 50);