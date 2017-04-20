$(document).ready(function() {
    var user_name = getCookie('myname'),
        user_picture = getCookie('mypicture');

    socket.on('connect', function() {
        console.log(socket.id);
    });

    socket.on('response', function(data) {
        console.log(data);
    });

    socket.on('user_connect', function(user_tab) {
        $('#allprofil').remove();
        $('#profil').append('<div id="allprofil"></div>');
        for (var i=0; i < user_tab.length; i++) {
            user_tab[i];
            $('#allprofil').append('<div class="profil"><img class="picture" src="' + user_tab[i].picture + '"><div class="user"><div class="username"><div class="name">' + user_tab[i].name + '</div><div class="pseudo">@ohyoyo</div></div><div class="connect"></div></div></div>');
        } 
    });
    
    function sendmessage() {
        console.log($('#message').val());

        if($('#message').val() <= 0)
            return console.log('please write something');
        var message_obj = {
            message: $('#message').val(),
            user: user_name,
            picture: user_picture
        };
        console.log(message_obj);
        socket.emit('message', message_obj);
        $('#message').val('');
    }

    document.addEventListener('keydown', function(e) {
        if(e.keyCode == 13)
            sendmessage();
    });
    
    $('#submit').click(function() {
        sendmessage();
    });

    socket.on('readmessage', function(data) {
        console.log(data);
        
        var sdate = new Date(data.time);
        console.log(sdate);
        var limessage = [
            '<li class="other">'+
                '<div class="name">'+data.content.user+'</div>'+
                '<div class="bulle blue">'+
                    '<img class="picture" src="'+data.content.picture+'"></div>'+
                    '<div class="message">'+data.content.message+'</div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul').append(limessage);
    });

    socket.on('mymessage', function(data) {
        var sdate = new Date(data.time);
        console.log(sdate);
        var slimessage = [
            '<li class="me">'+
                '<div class="name">Moi</div>'+
                '<div class="bulle grey">'+
                    '<img class="picture" src="'+data.content.picture+'"/div>'+
                    '<div class="message">'+data.content.message+'</div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul').append(slimessage);
    });
});