/**/
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
var emoji   = require('node-emoji');

/* variable public */
var port    = 1337,
    Time = function() {
        var newDate = new Date();
        return newDate.getTime();
    },
    user_tab = [],
    i = 0;

/* links */
app.use('/src/css/', express.static(__dirname + '/assets/css'));
app.use('/src/js/', express.static(__dirname + '/assets/js'));
app.use('/src/img/', express.static(__dirname + '/assets/img'));
app.use('/src/fonts/', express.static(__dirname + '/assets/fonts'));
app.use('/', express.static(__dirname + '/views'));

io.on('connection', function(socket) {
    console.log('id connect : ' + socket.id);
    
    
    socket.on('fb_user', function(obj) {
        user_tab[i] = obj;
        ++i;
        io.emit('user_connect', user_tab);
    });
    
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', {
            user_name   : data.user_name,
            bubble_color: data.bubble_color
      });
    });

    socket.on('imggiphy', function(data) {
        console.log('img gipfy : ' + data.gif_id );
        socket.broadcast.emit('gif_other', {
            user            : data.user,
            picture         : data.picture,
            gif             : data.gif_id,
            type            : 'gif',
            time            : Time(),
            bubble_color    : data.bubble_color
        });
        socket.emit('gif_me', {
            user            : data.user,
            picture         : data.picture,
            gif             : data.gif_id,
            type            : 'gif',
            time            : Time(),
            bubble_color    : data.bubble_color
        });
    });
    
    socket.on('message', function(data) {
        socket.broadcast.emit('readmessage', {
            user            : data.user,
            picture         : data.picture,
            message         : data.message,
            type            : 'message',
            time            : Time(),
            bubble_color    : data.bubble_color
        });
        
        socket.emit('mymessage', {
            message : data.message,
            type    : 'message',
            time    : Time(),
        });
        
    });

    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnect');
    });
});

server.listen(port);
console.log('server ready on port ' + port);