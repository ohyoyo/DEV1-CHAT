$(document).ready(function() {
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
    var user_name = getCookie('myname'),
        user_picture = getCookie('mypicture');
    socket.on('connect', function() {
        console.log(socket.id);
    });

    socket.on('response', function(data) {
        console.log(data);
    });

    socket.on('user_connect', function(user_tab) {
        for (var i=0; i < user_tab.length; i++) {
            user_tab[i];
            var userConnect = [
                '<div class="profil">'+
                    '<img class="picture" src="' + user_tab[i].picture + '">'+
                    '<div class="user">'+
                        '<div class="username">'+
                            '<div class="name">' + user_tab[i].name + '</div>'+
                            '<div class="pseudo">' + user_tab[i].id + '</div>'+
                        '</div>'+
                        '<div class="connect"> </div>'+
                    '</div>'+
                '</div>'
            ].join();
            $('#profil').append(userConnect);
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
        if(e.keyCode == 13 && $('#message').focus())
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
                '<div class="name">Other</div>'+
                '<div class="bubble '+bubbleColor+'">'+
                    '<img class="picture" src="'+data.content.picture+'">'+
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
                '<div class="bubble grey">'+
                    '<img class="picture" src="'+data.content.picture+'">'+
                    '<div class="message">'+data.content.message+'</div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul').append(slimessage);
    });
    
    $("#inputemoji").hover(function() {
        $('#gifbox').show();
    }, function() {
        $('#gifbox').hide();
    });

    $("#gifbox").hover(function() {
        $('#gifbox').show();
    }, function() {
        $('#gifbox').hide();
    });
    
/* GIPHY API CONNECT */
    var getGiphy = function(id, callback) {
        var idGiphy = function(id) {
            var key = 'dc6zaTOxFJmzC';
            if(id == 'trending')
                return 'http://api.giphy.com/v1/gifs/trending?api_key='+key;
        }

        $.get(idGiphy(id), function(jsonP) {
            $.ajax({
                url: idGiphy(id),
                type: 'GET',
                success: function(data) {
                    console.log(data);
                    callback(data);
                },
                error: function(err) {
                    console.log(err.code + err.message);
                }
            });
        });
    }

    getGiphy('trending', function(data) {
        for(var e = 0; e < data.data.length; e++) {
            $('#giphy').append('<img class="gif-giphy" src="'+data.data[e].images.downsized.url+'" data-id="'+data.data[e].id+'">');
            console.log('<img class="gif-giphy" src="'+data.data[e].images.downsized.url+'" data-id="'+data.data[e].id+'">');
        }
    });
});