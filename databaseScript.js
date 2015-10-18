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
            location.reload();
        } else if (snapshot.child("cmd").val() == "ALERT") {
            $("body").append('<div style="width: 100%; height: 100%; background-color: red; color: white; z-index: 1000;">' + snapshot.child("alert").val() + '</div>')
        } else {
            $("#messages").append('<p class="inMessage"><b>' + snapshot.child("name").val() + '</b> ' + snapshot.child("msg").val() + '</p>');
        }
    }

    $("#messageInput").keydown(function (e) {
        if (e.keyCode == 13) {
            submitMessage();
        }

    });

    $("#submitInput").click(submitMessage);

    fb.child("UID").child("GROUPNAME").on("child_added", function (snapshot, prevChildKey) {
        loadMessages(snapshot);
    });

});