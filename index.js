var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twitter = require('twitter');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/martin.html'));
});

app.get('/toggle', function(req, res) {
  var date = new Date();
  console.log(date + ": The Button has been pressed")
  io.emit('season change', 'summer');

  client.post('statuses/update', {status: "We're proudly celebrating #ALD15 at @ThoughtWorks #hierkommtada #ThoughtworksDE"},  function(error, tweet, response){
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
