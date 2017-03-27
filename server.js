var express = require('express');
var app =  express();
var server =  require('http').createServer(app);
var io = require('socket.io')(server);
var port = 1337;

app.use('/css', express.static(__dirname + '/assets/css'));
app.use('/js', express.static(__dirname + '/assets/js'));
app.use('/images', express.static(__dirname + '/assets/images'));
app.use('/fonts', express.static(__dirname + '/assets/fonts'));
app.use('/', express.static(__dirname + '/views'));

io.on('connection', function (socket){
    //new connection
    console.log('nouvelle connection sur socket');
    console.log(socket.id);
});

server.listen(port);
console.log("application work on port " + port);