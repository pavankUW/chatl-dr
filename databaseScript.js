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
        $("#messages").append('<p class="inMessage"><b>'+snapshot.child("name").val()+'</b> '+snapshot.child("msg").val()+'</p>');
    }

    $("#messageInput").keydown(function (e) {
        if(e.keyCode == 13) {
            submitMessage();
        }
        
    });

    $("#submitInput").click(submitMessage);
    
    fb.child("UID").child("GROUPNAME").on("child_added", function(snapshot, prevChildKey) {
        loadMessages(snapshot);
    });
    
});