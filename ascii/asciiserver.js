var net = require('net');
var _ = require('lodash');

var sockets = [];
var intervals = [];
var off = 0;
var direction = 1;

var fancyMartin = "\n"+
"                          ╦▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌╣▓▒⌐\n"+
"                        ╓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▄╖\n"+
"                     ╖╣▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌▄,µ\n"+
"                  ,╗▌▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓Q\n"+
"                ,╣██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒\n"+
"              ╪▒▓▓▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌╤\n"+
"            ╓▌▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▌╣\n"+
"            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▓▒\n"+
"           ▒█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▀δδÑ░░░▒██▒▒█▓▓▓▓▓▓█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒\n"+
"           ▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▒δ░    ⌐⌂╙╨░░░░δδδδδδ░δ▒▒▒█▓▓▓▓▓▓▓▓▓▓▓▌⌐\n"+
"           ▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█Θ░           `░      ''░░░░░╬▒▓▓▓▓▓▓▓▓▓▓Γ\n"+
"           ▀╬▓▓▓▓▓▓▓▓▓▓█▀ΣΓⁿ                       ' '░░░╣▒▓▓▓▓▓▓▓▓▌\n"+
"            ╚▓▓▓▓▓▓▓▓█δ░                            ' ░░░░╢▓▓▓▓▓▓▓▓Θ\n"+
"            :█▓▓▓▓▓█δ░                               '░░░░╢█▓▓▓▓▓▓▌\n"+
"            «▓▓▓▓▓▓▒░                                '░░░░░▒▓▓▓▓▓▓δ\n"+
"             ╟▓▓▓▓▓▌░⌐                               -░░░░░╠█▓▓▓▓▓`\n"+
"              ▒▓▓▓▓▌░     ⌐░░╣╣╢░░░░        ⌐░░╢╠╬╣Θ░░░░░░░░╢▓▓▓▓▌\n"+
"             ░δ▒▓▓▓▒     -╓╦╗▄▒▒▒╣░░░░⌐   '░╢╣╣▒▒▄▄▄▒▄Q░░░⌐⌐╙▓▓▓▒▒╡\n"+
"              ⌐ ╠█▓Θ    ░░δ░║▓▓▓C`░░░░░   ░╢▒▒Θ ╚▓▓▓Θ░▒▒╬░░⌐⌂█▓█░δ\n"+
"                ░▒▌░         ╙Γ╙ '' ░░░   ░░░░░ '╙Γ'░░░░░░⌐  ▒▌░░\n"+
"               '░▒░⌐               ''     ░░░░░⌐      '' '░  ╫▒╣░\n"+
"                  ╫░                      ░░░░░░⌐        -░⌐ ╟░░⌐\n"+
"                  ░░               '⌐⌐    '░░░╢░░⌐    ⌐ -░░⌐ ░░\n"+
"                   '              ░⌐      '░░░╢▒░⌐⌐⌐⌐ '░░░░░ ░`\n"+
"                                ⌐░░░╣▒╦░░╖▄▄▄╣▒▒Θ░░░░░░░░░░░ ░\n"+
"                    ⌐             '░╟▒▒╬▒▒▒█▌▒░'░░ ░░░░░░░░░░\n"+
"                     ░⌐    ⌐       ╓╣▒▌▓▓▓▌▓▓▌╣░░ -░░░░░░░░░\n"+
"                     ░░░⌐'░░░░░╦╢╣▒▓█████████▓▓▒▒▒╣╣░░░░░░░╣⌐\n"+
"                     ░░░░░░░▒▒▒███▒▒▒╣╣╣╣▄▒▒▒▒▒████▌▒╣░░╢▒╣░\n"+
"                     ╘╢░░░░░░░░  ░░░░░░░░░░░░░░░░░░░╢░░╣▒▒▒╡\n"+
"                      ░░░╦░░░░░⌐⌐ ░░╢╣╣▒▒▒▒▒▒▒╣░░░░░░╢▒▒▌▒▒⌐\n"+
"                      ╙╣╢╣░░░░░░░░⌐' ░╨δδδδ░░░░░░░░░╬▒▒▓▓▌▒\n"+
"                       ░▒▒▒▒▒╣╬░⌐'         ' '░░░░╢╣▌▓▓▓▓▒░⌐½\n"+
"                        'Σ█▓▓▌▌╣╦░░,    -⌐⌐-░░░╢╬╣▒▓▓▓▓█▒╣░░µ▀▄\n"+
"                      ⌐  ░░▒█▓▓▓▓▌▒╣╣╣╣░╣╣╣╣▒▌▓▓▓▓▓▓▓▓█▒╣░░╢▌ ▓▓▒▄,\n"+
"                    ╖▒   '░░░δ▀█▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓█▒▒╬░░╢╣▒  ▓▓▓▓▓▄╦▄,\n"+
"\n";

var receiveData = function(socket, data) {

}

var newSocket = function(socket) {
	sockets.push(socket);

	var interval = setInterval(function() {
			socket.write(clear());
			socket.write(writeAscii());
	}, 50);

	intervals[socket] = interval;

	socket.on("data", function(data) {
		receiveData(socket, data);
	})

	socket.on("end", function() {
		closeSocket(socket);
	});
}

var closeSocket = function(socket) {
	var i = sockets.indexOf(socket);
	if(i != -1) {
		sockets.splice(i, 1);
		clearInterval(intervals[socket]);
		console.log("Disconnected");
	}
}

var clear = function() {
	return "\033[2J \033[H";
}

var writeAscii = function() {
	if(direction === 1 && off > 100) {
		direction = -1;
	} else if(direction === -1 && off === 0) {
		direction = 1;
	}

	off += direction;
	var asciiLines = fancyMartin.split("\n");
	var padding = "";
	for(var i = 0; i < off; i++) {
		padding += " ";
	}

	var paddedLines = [];
	for(var i = 0; i < asciiLines.length; i++) {
		paddedLines.push(padding + asciiLines[i]);
	}

	var outputString = paddedLines.join("\n");
	return outputString;
}

var server = net.createServer(newSocket);
server.listen(8000);
