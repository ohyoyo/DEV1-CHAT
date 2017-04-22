

function statusChangeCallback(response) {
    //console.log(response);
    if (response.status === 'connected') {
        connectAPI();
        $('section#welcome').hide('clip', 500);
        $('.loadPage').delay(500).show(1000).delay(1000).hide('fade', 500);
        $('section#messenger').delay(3000).show();
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
    var user_obj = {};
    FB.api('/me', function(response) {
        user_obj = {
            name: response.name,
            fb_id: response.id,
            socket_id: socket.id
        };
        console.log(user_obj);
        FB.api("/" + user_obj.fb_id + "/picture", function (rpic) {
            if (rpic && !rpic.error) {
                user_obj.picture = rpic.data.url;
                console.log(user_obj);
                setCookie('myname', user_obj.name, 30);
                setCookie('mypicture', user_obj.picture, 30);
                socket.emit('fb_user', user_obj);
            }
        });
    });
}