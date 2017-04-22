var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
var port    = 1337;
var Time = function() {
    var newDate = new Date();
    return newDate.getTime();
}
var user_tab = [],
    i = 0;

app.use('/src/css/', express.static(__dirname + '/assets/css'));
app.use('/src/js/', express.static(__dirname + '/assets/js'));
app.use('/src/img/', express.static(__dirname + '/assets/img'));
app.use('/src/fonts/', express.static(__dirname + '/assets/fonts'));
app.use('/', express.static(__dirname + '/views'));

io.on('connection', function(socket) {
    console.log('id connect : ' + socket.id);
    
    
    socket.on('fb_user', function(obj) {
        console.log('toto');
        user_tab[i] = obj;
        ++i;
        io.emit('user_connect', user_tab);
    });
    
    socket.on('typing', function (data) {
      console.log(data);
      socket.broadcast.emit('typing', data);
    });
    
    socket.on('message', function(message) {
        socket.broadcast.emit('readmessage', {
            content : message,
            time : Time(),
        });
        
        socket.emit('mymessage', {
            content : message,
            time : Time(),
        });
        
    });
    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnect');
        for (var j=0; socket.id != user_tab[j].socket_id; j++);
        console.log('socket');
        io.emit('user_disconnect', {
            tab: user_tab,
            pos: j
        });
        console.log('attend');
        var x = 5;
        console.log(x);
        var y = setInterval(function() {
            --x;
            console.log(x);
        }, 1000);
        setTimeout(function() {
            clearInterval(y);
            console.log(user_tab.length + ' ' + j);
            user_tab.splice(j, 1);
            console.log(user_tab.length);
            io.emit('user_connect', user_tab);
        }, x * 1000);
        
    });
});

server.listen(port);
console.log('server ready on port ' + port);