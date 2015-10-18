function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {
    
    var GROUP_ID = getParam("room");
    var NAME_ID = getParam("name");
    var PASS_ID = getParam("pass");
    var JOIN_TRUE = getParam("action");

    function submitMessage() {
        fb.child(GROUP_ID).child("messages").push({
            name: NAME_ID,
            msg: $("#messageInput").val(),
            time: Date.now()
        });
        $("#messageInput").val("");
    }

    function loadMessages(snapshot) {
        if (snapshot.child("cmd").val() == "REFRESH") {
            if(Date.now() < snapshot.child("expire").val()) {
                location.reload(false);
            }
        } else if (snapshot.child("cmd").val() == "ALERT") {
            $("body").attr("style", "overflow: hidden;");
            $("body").append('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: red; text-align: center; color: white; z-index: 1000;"><h1>' + snapshot.child("alert").val() + '</h1></div>')
        } else {
            if(NAME_ID == snapshot.child("name").val()) {
                $("#messages").append('<p class="outMessage">' + snapshot.child("msg").val() + '</p>');
            } else {
                $("#messages").append('<p class="inMessage"><b>' + snapshot.child("name").val() + '</b> ' + snapshot.child("msg").val() + '</p>');
            }
            $("#messages").scrollTop($("#messages")[0].scrollHeight);
        }
    }

    $("#messageInput").keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            submitMessage();
        }

    });

    $("#submitInput").click(submitMessage);

    fb.child(GROUP_ID).child("messages").on("child_added", function (snapshot, prevChildKey) {
        loadMessages(snapshot);
    });

});