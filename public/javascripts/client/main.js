var sockets = require("./socketclient.js");
var game_client = require("./gameclient.js");


var network = new sockets();
var client = new game_client();

network.handlers["gameserver.connection"] = function (data) {
    console.log("GameServerConnectionChanged - New Status: ", data.message);
    client.start(network);
};

setInterval(function () {
    socket.send_message({
        path: "testpath",
        message: "test_message"
    });
}, 1000 / 50);