/* COOKIE LIBRARY */
/* function create cookie */
function setCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
}
/* function recuperate cookie */
function getCookie(name) {
    var nameEQ = name + '=',
        ca = document.cookie.split(';');
    for (var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
/* function delete one cookie */
function eraseCookie(name) {
    setCookie(name, '', -1);
}
/* END OF LIBRARY */
/* FUNCTION AFTER CHARGING DOM */
$(document).ready(function() {
    /* variable générale de la function */
    var user,
        bubbleColor,
        timeout,
        Time = function() {
            var newDate = new Date();
            return newDate.getTime();
        },
        random = Math.floor((Math.random() * 3) + 1);

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
    
    /* verification de la présence du serveur */
    socket.on('connect', function() {
        
    });
    
    /* affichage des utilisateurs */
    socket.on('yourinfo', function(obj) {
        console.log('4')
        user = obj;
    });
    
    socket.on('user_connect', function(user_tab) {
        console.log('3')
        $('#allprofil').remove();
        console.log('allprofil remove');
        $('#profil').append('<div id="allprofil" class="profil"></div>');
        console.log('allprofil recreate');
        for (var i=0; i < user_tab.length; i++) {
            console.log(user_tab[i]);
            var userConnect = [
                '<div class="profil">'+
                    '<img class="picture" src="' + user_tab[i].picture + '">'+
                    '<div class="user animated">'+
                        '<div class="username">'+
                            '<div class="name">' + user_tab[i].name + '</div>'+
                            //'<div class="pseudo">' + user_tab[i].id + '</div>'+
                        '</div>'+
                        '<div class="connect"> </div>'+
                    '</div>'+
                '</div>'
            ].join();
            $('#allprofil').append(userConnect);
        }
    });
//    
//    $('#connectAnonyme').click(function() {
//        
//    });

    socket.on('user_disconnect', function(obj) {
        document.getElementsByClassName('connect')[obj.pos].setAttribute('class', 'disconnect');
    });
    
    /* affichage/masquage du bouton de (dé)connexion */
    $('#menu').click(function() {
        $('#menu-c').slideToggle('slow', function() {
            if($(this).is(':visible')){}
            else if($(this).is(':hidden')){}
        });
    });

    /* vérification de l'utilisation de l'input */
    function timeoutFunction() {
        typing = false;
        socket.emit("typing", 'false');
    }

    $('#message').keyup(function() {
        typing = true;
        socket.emit('typing', {
            user_name   : user.name,
            bubble_color: bubbleColor
        });

        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 2000);
    });

    socket.on('typing', function(data) {
        if (data != 'false') {
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
            $('#tiping').remove();
            $('#mess').append('<ul id="tiping"></ul>');
        }
    });

    /* envoi d'un message */
    function sendmessage() {
        if($('#message').val() <= 0)
            return;

        var message_obj = {
            message: $('#message').val(),
            user: user.name,
            picture: user.picture
        };
        
        socket.emit('message', message_obj);
        $('#message').val('');
    }

    document.addEventListener('keydown', function(e) {
        if(e.keyCode == 13)
            sendmessage();
    });

    $('#submit').click(sendmessage);

    /* récéption et affichage des messages */
    socket.on('readmessage', function(data) {
        var sdate = new Date(data.time);
        var message_check = encodeURIComponent(data.content.message).replace(/3C/g, '< ').replace(/3E/g, ' >');
        message_check = decodeURIComponent(message_check);
        var limessage = [
            '<li class="other">'+
                '<div class="name">'+data.content.user+'</div>'+
                '<div class="bubble '+bubbleColor+'">'+
                    '<img class="picture" src="'+data.content.picture+'">'+
                    '<div class="message">'+message_check+'</div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        $('ul#listmessage').append(limessage);
        $('ul#listmessage').scrollTop($('ul#listmessage')[0].scrollHeight);
    });

    socket.on('mymessage', function(data) {
        var sdate = new Date(data.time);
        var message_check = encodeURIComponent(data.content.message).replace(/%3C/g, '< ').replace(/%3E/g, ' >');
        var message_check = decodeURIComponent(message_check);
        var slimessage = [
            '<li class="me">'+
            '<div class="name">Moi</div>'+
            '<div class="bubble grey">'+
            '<img class="picture" src="'+data.content.picture+'">'+
            '<div class="message">'+message_check+'</div>'+
            '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
            '</div>'+
            '</li>'
        ].join();
        $('ul#listmessage').append(slimessage);
        $('ul#listmessage').scrollTop($('ul#listmessage')[0].scrollHeight);
    });

    $('#closeHeader').click(function() {
        if($('section#messenger header#nav').css('width') == '100px'){
            $(this).css('background-image', 'url("src/img/picto/ic_keyboard_return_black_24px.svg")');
            $('section#messenger header#nav').animate({
                width   : '25%'
            }, 500);
            $('.profil .user .username').show();
            $('.profil .user').animate({
                backgroundColor    : 'white'
            }, 500);
        } else {
            $(this).css('background-image', 'url("src/img/picto/ic_keyboard_tab_black_24px.svg")');
            $('section#messenger header#nav').animate({
                width   : '100px'
            }, 500);
            $('.profil .user .username').hide();
            $('.profil .user').animate({
                backgroundColor    : 'transparent'
            }, 500);
        }
    });

    /* GIPHY API CONNECT */
    function getGiphy(search, id, callback) {
        function idGiphy(search) {
            var key = 'dc6zaTOxFJmzC';
            if(search == 'trending')
                return 'https://api.giphy.com/v1/gifs/trending?api_key='+key;
            else if(search == 'id')
                return 'https://api.giphy.com/v1/gifs/'+id+'?api_key='+key;
        }
        $.get(idGiphy(search), '', function(jsonP) {
            $.ajax({
                url: idGiphy(search),
                type: 'GET',
                success: function(data) {
                    callback(data);
                },
                error: function(err) {
                    console.log(err.code + err.message);
                }
            });
        });
    }
    
    getGiphy('trending', '', function(data) {
        for(var e = 0; e < data.data.length; e++) {
            $('#giphy').append('<img class="gif-giphy" src="'+data.data[e].images.downsized.url+'" data-id="'+data.data[e].id+'">');
        }
    });
    
    /* affichage des gif disponible */
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
    
    /* choix et envoi du gif */
    $('#giphy').on('click', 'img', function() {
        socket.emit('imggiphy', {
            gif_id          : $(this).data('id'),
            user            : user.name,
            picture         : user.picture,
            bubble_color    : bubbleColor
        });
    });
    
    /* récéption des gif */
    socket.on('gif_other', function(obj) {
        var sdate = new Date(obj.time),
        url = getGiphy('id', obj.gif, function(data) {
        var limessage = [
            '<li class="other">'+
            '<div class="name">'+obj.user+'</div>'+
            '<div class="bubble '+obj.bubble_color+'">'+
            '<img class="picture" src="'+obj.picture+'">'+
            '<div class="message"><img width="100%" src="'+data.data.images.downsized.url+'"></div>'+
            '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
            '</div>'+
            '</li>'
        ].join();
        $('ul#listmessage').append(limessage);
        $('ul#listmessage').scrollTop($('ul#listmessage')[0].scrollHeight);
        });
    });
    
    socket.on('gif_me', function(data) {
        var url = undefined,
            sdate = new Date(data.time),
            url = getGiphy('id', data.gif, function(data) {
                var slimessage = [
                '<li class="me">'+
                '<div class="name">Moi</div>'+
                '<div class="bubble grey">'+
                '<img class="picture" src="'+user.picture+'">'+
                '<div class="message"><img width="100%" src="'+data.data.images.downsized.url+'"></div>'+
                '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
                '</li>'
            ].join();
            $('ul#listmessage').append(slimessage);
            $('ul#listmessage').scrollTop($('ul#listmessage')[0].scrollHeight);
        });  
    });

});