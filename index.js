var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  console.log("GET request received on /");
  res.send('Hier kommt Martin');
});

app.get('/content', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/martin.html'));
});

app.get('/summer', function(req, res) {
  res.send('Activated summer mode');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
