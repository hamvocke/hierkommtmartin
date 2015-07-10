var net = require('net');
var _ = require('lodash');

var off = 0;
var interval;

var server = net.createServer(function(socket) {
	console.log("Client connected");
	socket.on("end", function() {
		clearInterval(interval);
		console.log("Disconnected");
	});
	clear(socket);
	socket.write("Welcome to Asciimartin");
	interval = setInterval(function() { writeAscii(socket) }, 50);
});

server.listen(8000);

var asciiString = ""+
"Martin\n"+
"Martin\n"+
"Martin\n";

var clear = function(socket) {
	socket.write('\033[2J');
	socket.write('\033[H');
}

var writeAscii = function(socket) {
	off++;
	clear(socket);
	var asciiLines = asciiString.split("\n");
	var padding = "";
	for(var i = 0; i < off; i++) {
		padding += " ";
	}

	var paddedLines = [];
	for(var i = 0; i < asciiLines.length; i++) {
		paddedLines.push(padding + asciiLines[i]);
	}

	var outputString = paddedLines.join("\n");
	socket.write(outputString);
}
