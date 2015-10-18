function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {

    function tryCreate(name, room, pass, query) {

        fb.once("value", function (snapshot) {
            if (snapshot.child(room).exists()) {
                alert("NO");
                $("body").append('<div class="errorPopup">That room already exists!</div>');
            } else {
                alert("Trying to join...");
                tryJoin(name, room, pass, query);
            }
        });

    }

    function tryJoin(name, room, pass, query) {



        window.location.href = query;
    }

    $('#Create').click(function () {
        var Name = ($('#Name').val());
        var Room = ($('#Room').val());
        var Pass = ($('#Pass').val());
        var x = "http://chatldr.me/chat.html?action=create&name=" + Name + "&room=" + Room;
        tryCreate(Name, Room, Pass, x);
    });
    $('#Join').click(function () {
        var Name = ($('#Name').val());
        var Room = ($('#Room').val());
        var Pass = ($('#Pass').val());
        var x = "http://chatldr.me/chat.html?action=join&name=" + Name + "&room=" + Room;
        tryJoin(Name, Room, Pass, x);
    });

});