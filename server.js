/* node package */

var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);

/* variable global */

var port    = 8080,
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

/* execution */

io.on('connection', function(socket) {
    console.log('id connect : ' + socket.id);
    
    /* affichage user */
    
    socket.on('fb_user', function(obj) {
        console.log('toto');
        user_tab[i] = obj;
        ++i;
        io.emit('user_connect', user_tab);
        socket.emit('yourinfo', obj);
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
    
    /* user is typing something */
    
    socket.on('typing', function (data) {
      console.log(data);
      socket.broadcast.emit('typing', data);
    });
    
    /* user send message */
    
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
    
    /* user send gif */
    
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
});

server.listen(port); //lecture du port de sortie du chat
console.log('server ready on port ' + port); // message de démarage