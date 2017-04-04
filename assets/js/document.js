function statusChangeCallback(response) {
    console.log(response);
    if (response.status === 'connected') {
        connectAPI();
        $('section#welcome').hide('clip', 500);
        $('.loadPage').show(1000).delay(1000).hide('fade', 500);
        $('section#messenger').show();
    } else {
        $('section#welcome .container-box').hide().delay(1000).show('blind', 500);
        document.getElementById('status').innerHTML = 'connect toi bitch';
    }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '1361297530593584',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.8'
    });

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

function connectAPI() {
    FB.api('/me', function(response) {
        document.getElementById('status').innerHTML = 'ok, ' + response.name + '!';
        console.log(response);
        socket.emit('fb_user_id', response.id);
    });
}