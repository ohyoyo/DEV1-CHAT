var Time = function() { var newDate = new Date(); return newDate.getTime(); }
var socket = io();

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
    $('.gif-giphy').click(function() {
        alert('ok');
        alert($('.gif-giphy').data('id'));
        socket.emit('imggiphy', $('.gif-giphy').data('id'));
    });
    
    $('#inputemoji').click(function() {

    });
    
    $('#menu').click(function() {
        if($(this).is(':visible'))
            $('#menu-c').show();
        else
            $('#menu-c').hide();
    });
});
