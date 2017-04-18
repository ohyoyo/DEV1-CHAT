$(document).ready(function() {
    socket.on('connect', function() {
        console.log(socket.id);
    });

    socket.on('response', function(data) {
        console.log(data);
    });

    function sendmessage() {
        console.log($('input').val());

        if($('input').val() <= 0)
            return console.log('please write something');

        socket.broadcast.emit('message', $('input').val());
        $('input').val('');
    }

    document.addEventListener('keydown', function(e) {
        if(e.keyCode == 13)
            sendmessage();
    });

    socket.on('readmessage', function(data) {
        console.log(data);

        $('ul').append('<li>' + data.content + '</li>');
    });
});