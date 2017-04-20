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
                '<div class="bubble '+bubbleColor+'">'+
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
                '<div class="bubble grey">'+
                    '<div class="picture"></div>'+
                    '<div class="message">'+data.content+'</div>'+
                    '<div class="time">'+sdate.getHours()+'h'+sdate.getMinutes()+'</div>'+
                '</div>'+
            '</li>'
        ].join();
        
        $('ul').append(slimessage);
    });
});