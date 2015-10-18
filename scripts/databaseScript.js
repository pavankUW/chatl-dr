$(document).ready(function () {

    function submitMessage() {
        fb.child("UID").child("GROUPNAME").push({
            name: "USERNAME",
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
            $("#messages").append('<p class="inMessage"><b>' + snapshot.child("name").val() + '</b> ' + snapshot.child("msg").val() + '</p>');
        }
    }

    $("#messageInput").keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            submitMessage();
        }

    });

    $("#submitInput").click(submitMessage);

    fb.child("UID").child("GROUPNAME").on("child_added", function (snapshot, prevChildKey) {
        loadMessages(snapshot);
    });

});