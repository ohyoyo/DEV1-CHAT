$(document).ready(function() {
    socket.on('connect', function() {
        console.log(socket.id);
    });

    socket.on('response', function(data) {
        console.log(data);
    });

    function sendmessage() {
        console.log($('input').val());

        if($('input').val() <= 0)
            return console.log('please write something');

        socket.emit('message', $('input').val());
        $('input').val('');
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
                '<div class="name">Other</div>'+
                '<div class="bulle blue">'+
                    '<div class="picture"></div>'+
                    '<div class="message">'+data.content+'</div>'+
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
                    '<div class="picture"></div>'+
                    '<div class="message">'+data.content+'</div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul').append(slimessage);
    });
});