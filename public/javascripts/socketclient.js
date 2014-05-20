function SocketClient(host) {
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
        console.timeEnd("ping");
        console.log(data);
        if (that.handlers[data.path])
            that.handlers[data.path](data);
    });

    this.send_message = function (message)
    {
        console.time("ping");
        if (that.id == null) {
            console.log("SocketClient.send_message called with no connection id set. Ignoring packet");
            return;
        }

        if (message.id !== 'undefined')
            message.id == that.id;

        that.socket.emit("packet", message); 
    }
};