$(document).ready(function() {
<<<<<<< HEAD
    var bubbleColor;
    var random = Math.floor((Math.random() * 3) + 1);
    switch(random) {
        case 1 :
            bubbleColor = 'green';
            break;
        case 2 :
            bubbleColor = 'red';
            break;
        case 3 :
            bubbleColor = 'blue';
            break;
    }
=======
    var user_name = getCookie('myname'),
        user_picture = getCookie('mypicture');
>>>>>>> 8a475b381d8b851fa8d6806fa66af5d1ec23c411

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
    
    var timeout;

    function timeoutFunction() {
        typing = false;
        socket.emit("typing", false);
    }

    $('#message').keyup(function() {
        console.log('happening');
        typing = true;
        socket.emit('typing', 'typing...'); // le text que tu veux afficher
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 2000);
    });

    socket.on('typing', function(data) {
        if (data) {
            console.log(data); //quand tu dois afficher is typing
        } else {
            console.log(""); // quand il doit pas s'afficher
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
<<<<<<< HEAD
                '<div class="name">Other</div>'+
                '<div class="bubble '+bubbleColor+'">'+
                    '<div class="picture"></div>'+
                    '<div class="message">'+data.content+'</div>'+
=======
                '<div class="name">'+data.content.user+'</div>'+
                '<div class="bulle blue">'+
                    '<img class="picture" src="'+data.content.picture+'">'+
                    '<div class="message">'+data.content.message+'</div>'+
>>>>>>> 8a475b381d8b851fa8d6806fa66af5d1ec23c411
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
<<<<<<< HEAD
                '<div class="bubble grey">'+
                    '<div class="picture"></div>'+
                    '<div class="message">'+data.content+'</div>'+
=======
                '<div class="bulle grey">'+
                    '<img class="picture" src="'+data.content.picture+'">'+
                    '<div class="message">'+data.content.message+'</div>'+
>>>>>>> 8a475b381d8b851fa8d6806fa66af5d1ec23c411
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul').append(slimessage);
    });
});