var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twitter = require('twitter');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


var client = new Twitter({
  consumer_key: 'rQyXZymr8H4FiYMGcwZUMaksP',
  consumer_secret: 'qvBgUcrEUQ511oftxRjxwjozCCJv6Fi6vABrQyXOhj6fvHNJrk',
  access_token_key: '3177457618-woh0zfOKhx1Je6r2dZamO1iKtcEfYBfK2aCiU9V',
  access_token_secret: '5qpK4PZqZxxJPWm04fd3tkhetqa7xlhneRupDcrrgaQnE'
});


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/martin.html'));
});

app.get('/toggle', function(req, res) {
  var date = new Date().getTime();
  console.log(date + ": The Button has been pressed")
  io.emit('season change', 'summer');

  client.post('statuses/update', {status: 'The button has been pressed. #hierkommtmartin #twde'},  function(error, tweet, response){
    if(error) {
      console.log("Error occured sending tweet:");
      console.log(error);
      console.log(tweet);  // Tweet body.
      console.log(response);  // Raw response object.
    }
  });

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
