$(document).ready(function() {
    /* FUNCTION COOKIE */
    function setCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
}
    
    // function edit Cookie
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }

        return null;
    }

    // function delete(name)
    function eraseCookie(name) {
        setCookie(name,"",-1);
    }
    
    /* END FUNCTION COOKIE */
    
    /* PUBLIC FUNCTION */
    var bubbleColor,
        timeout,
        random = Math.floor((Math.random() * 3) + 1),
        user_name = getCookie('myname'),
        user_picture = getCookie('mypicture');
    
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
    
    var Time = function() {
        var newDate = new Date();
        return newDate.getTime();
    },
        socket = io();

    $('.gif-giphy').click(function() {
        alert('ok');
        alert($('.gif-giphy').data('id'));
        socket.emit('imggiphy', $('.gif-giphy').data('id'));
    });
    
    $('#inputemoji').click(function() {

    });
    
    $('#menu').click(function() {
        $('#menu-c').slideToggle('slow', function() {
            if($(this).is(':visible')){}
            else if($(this).is(':hidden')){}
        });
    });

//    $("html, body").animate({ scrollTop: 500000}, 10);

    socket.on('connect', function() {
        console.log(socket.id);
    });
    
    socket.on('disconnect', function() {
        console.log('disconnect');
        var user_obj = {
            user    : user_name,
            picture : user_picture
        };
        
        socket.emit('user_disconnected', user_obj);
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
    
    socket.on('user_disconnect', function(obj) {
        document.getElementsByClassName('connect')[obj.pos].setAttribute('class', 'disconnect');
    });
    
    function timeoutFunction() {
        typing = false;
        socket.emit("typing", false);
    }

    $('#message').keyup(function() {
        console.log('happening');
        typing = true;
        socket.emit('typing', {
            user_name   : user_name,
            bubble_color: bubbleColor
        }); // le text que tu veux afficher
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 2000);
    });

    socket.on('typing', function(data) {
        if (data) {
            console.log(data);
            if($('li.tiping').data('user_id') != data.user_name){
                var liTiping = [
                    '<li data-user_id="'+data.user_name+'" class="tiping">'+
                        '<div class="bubble '+data.bubble_color+'"></div>'+
                        data.user_name+' est entrain d\'écrire'+
                    '</li>'
                ].join();
                
                $('ul#tiping').append(liTiping);
            }
        } else {
        }
        
        if(data == 'false')
            alert('return');
    });
    
    function sendmessage() {
        console.log($('#message').val());

        if($('#message').val() <= 0)
            return console.log('please write something');

        socket.emit('message', {
            message         : $('#message').val(),
            user            : user_name,
            picture         : user_picture,
            bubble_color    : bubbleColor
        });
        
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
        var sdate = new Date(data.time);
        var limessage = [
            '<li class="other">'+
                '<div class="name">'+data.user+'</div>'+
                '<div class="bubble '+data.bubble_color+'">'+
                    '<img class="picture" src="'+data.picture+'">'+
                    '<div class="message">'+data.message+'</div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul#listmessage').append(limessage);
    });

    socket.on('mymessage', function(data) {
        var sdate = new Date(data.time);
        console.log(sdate);
        var slimessage = [
            '<li class="me">'+
                '<div class="name">Moi</div>'+
                '<div class="bubble grey">'+
                    '<img class="picture" src="'+user_picture+'">'+
                    '<div class="message">'+data.message+'</div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul#listmessage').append(slimessage);
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
        }
    });
});