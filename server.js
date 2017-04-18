var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
var port    = 1337;
var Time = function() {
    var newDate = new Date();
    return newDate.getTime();
}
var fb_user_id;

app.use('/src/css/', express.static(__dirname + '/assets/css'));
app.use('/src/js/', express.static(__dirname + '/assets/js'));
app.use('/src/img/', express.static(__dirname + '/assets/img'));
app.use('/src/fonts/', express.static(__dirname + '/assets/fonts'));
app.use('/', express.static(__dirname + '/views'));

io.on('connection', function(socket) {
    console.log('id connect : ' + socket.id);
    
    
    socket.on('fb_user_id', function(id) {
        console.log('fb id : ' + id + ' connected to id socket : ' + socket.id);
        fb_user_id = id;
    });
    
    socket.on('message', function(message) {
        io.broadcast.emit('readmessage', {
            content : message,
            time : Time(),
            fb_user_id : fb_user_id
        });
        
    });
    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnect');
    });
});

server.listen(port);
console.log('server ready on port ' + port);