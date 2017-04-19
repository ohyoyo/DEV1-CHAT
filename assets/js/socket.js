var socket = io('http://localhost:1337');

$(document).ready(function() {
    socket.on('connect', function() {
        console.log(socket.id);
    });

    socket.on('response', function(data) {
        console.log(data);
    });
    
    socket.on('user_connect', function(user_tab) {
        $('#allprofil').remove();
        for (var i=0; i < user_tab.length; i++) {
            user_tab[i];
            $('#profil').append('<div class="profil"><img class="picture" src="' + user_tab[i].picture + '"><div class="user"><div class="username"><div class="name">' + user_tab[i].name + '</div><div class="pseudo">@ohyoyo</div></div><div class="connect"></div></div></div>');
        } 
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