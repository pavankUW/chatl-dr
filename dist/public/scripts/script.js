function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {
    
    $("#popup").fadeOut(0);

    function throwError(message) {
        $("#errorText").html(message);
        $(".errorPopup").animate({"-webkit-transform": "translate(0px, 0px)"}, 300);
        $("#popup").fadeIn(200);
    }
    

    function tryCreate(name, room, pass, query) {

        fb.once("value", function (snapshot) {
            if (snapshot.child(room).exists()) {
                throwError("That room already exists.");
            } else {
                fb.child(room).set({
                    pass: pass
                });
                tryJoin(name, room, pass, query);
            }
        });

    }

    function tryJoin(name, room, pass, query) {

        fb.once("value", function (snapshot) {
            if (!snapshot.child(room).exists()) {
                throwError("That room doesn't exist.");
            } else if (snapshot.child(room).child("users").child(name).exists()) {
                throwError("That name is already in use.");
            } else if (snapshot.child(room).child("pass").val() != pass) {
                throwError("Incorrect Password.");
            } else {
                window.location.href = query;
            }
        });

    }
    
    $("#close").click(function() {
        $("#popup").fadeOut(200);
    });

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