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

$(document).ready(function() {
    /* FUNCTION COOKIE */

    
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

    $('#giphy').on('click', 'img', function() {
        socket.emit('imggiphy', {
            gif_id          : $(this).data('id'),
            user            : user_name,
            picture         : user_picture,
            bubble_color    : bubbleColor
        });
    });
    
    socket.on('gif_other', function(obj) {
        console.log(obj.gif);
        var sdate = new Date(obj.time);
        var url = getGiphy('id', obj.gif, function(data) {
                var limessage = [
                    '<li class="other">'+
                        '<div class="name">'+obj.user+'</div>'+
                        '<div class="bubble '+obj.bubble_color+'">'+
                            '<img class="picture" src="'+obj.picture+'">'+
                            '<div class="message"><img src="'+data.data.images.downsized.url+'"></div>'+
                            '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                        '</div>'+
                    '</li>'
                ].join();
                $('ul#listmessage').append(limessage);
        });
        var limessage = [
            '<li class="other">'+
                '<div class="name">'+data.user+'</div>'+
                '<div class="bubble '+data.bubble_color+'">'+
                    '<img class="picture" src="'+data.picture+'">'+
                    '<div class="message"><img src="'+url+'"></div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul#listmessage').append(limessage);
    });
    
    socket.on('gif_me', function(data) {
        //console.log(data.gif);
        var url = undefined;
        var sdate = new Date(data.time);
        var url = getGiphy('id', data.gif, function(data) {
            var slimessage = [
            '<li class="me">'+
                '<div class="name">Moi</div>'+
                '<div class="bubble grey">'+
                    '<img class="picture" src="'+user_picture+'">'+
                    '<div class="message"><img src="'+data.data.images.downsized.url+'"></div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul#listmessage').append(slimessage);
        });
        //console.log(url)
        
       
    });
    
    $('#inputemoji').click(function() {

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
    var getGiphy = function(search, id, callback) {
        var idGiphy = function(search) {
            var key = 'dc6zaTOxFJmzC';
            if(search == 'trending')
                return 'http://api.giphy.com/v1/gifs/trending?api_key='+key;
            else if(search == 'id')
                return 'http://api.giphy.com/v1/gifs/'+id+'?api_key='+key;
        }

        $.get(idGiphy(search), '', function(jsonP) {
            $.ajax({
                url: idGiphy(search),
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

    getGiphy('trending', '', function(data) {
        for(var e = 0; e < data.data.length; e++) {
            $('#giphy').append('<img class="gif-giphy" src="'+data.data[e].images.downsized.url+'" data-id="'+data.data[e].id+'">');
        }
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
    
    var so_message = function(data) {
        if(data.type == 'message')
            return data.message;
        else if(data.type == 'gif'){
            getGiphy('id', data.message, function(data) {
                return data.data.images.downsized.url;
            });
        }
    }
        
    socket.on('readmessage', function(data) {
        
        var sdate = new Date(data.time);
        
        var limessage = [
            '<li class="other">'+
                '<div class="name">'+data.user+'</div>'+
                '<div class="bubble '+data.bubble_color+'">'+
                    '<img class="picture" src="'+data.picture+'">'+
                    '<div class="message">'+so_message(data)+'</div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul#listmessage').append(limessage);
    });

    socket.on('mymessage', function(data) {

        
        so_message(data);
        var sdate = new Date(data.time);
        var slimessage = [
            '<li class="me">'+
                '<div class="name">Moi</div>'+
                '<div class="bubble grey">'+
                    '<img class="picture" src="'+user_picture+'">'+
                    '<div class="message">'+so_message(data)+'</div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul#listmessage').append(slimessage);
    });
    
    $('#closeHeader').click(function() {
        if($('section#messenger header#nav').css('width') == '140px'){
            $(this).css('background-image', 'url("src/img/picto/ic_keyboard_return_black_24px.svg")');
            $('section#messenger header#nav').css('width', '25%');
        } else {
            $(this).css('background-image', 'url("src/img/picto/ic_keyboard_tab_black_24px.svg")');
            $('section#messenger header#nav').css('width', '140px');
        }
    });
});