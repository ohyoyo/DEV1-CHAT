function statusChangeCallback(response) {
    //console.log(response);
    if (response.status === 'connected') {
        connectAPI();
        $('section#welcome').hide('clip', 500);
        $('section#messenger').show();
    } else {
        $('section#welcome .container-box').show('blind', 500);
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
                socket.emit('fb_user', user_obj);
            }
        });
    });
}