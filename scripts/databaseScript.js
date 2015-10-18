function getParam(name) {
	
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {
	var PREFIX = "https://gateway.watsonplatform.net/concept-insights/api/v2"
    var GROUP_ID = getParam("room");
    var NAME_ID = getParam("name");
    var ACTION_ID = getParam("action");
	
    fb.child(GROUP_ID).child("users").child(NAME_ID).set("true");
    fb.child(GROUP_ID).child("messages").push({
        type: "status",
        name: NAME_ID,
        msg: " has entered the chat.",
        time: Date.now()
    });

    $("#peopleList").slideUp(0);

    $("#groupNameButton").html(GROUP_ID + '<i class="material-icons">keyboard_arrow_down</i>');

    $(window).unload(function () {
        fb.child(GROUP_ID).child("users").child(NAME_ID).set("false");
        fb.child(GROUP_ID).child("messages").push({
            type: "status",
            name: NAME_ID,
            msg: " has left the chat.",
            time: Date.now()
        });
    });

    function submitMessage() {
		
        fb.child(GROUP_ID).child("messages").push({
            name: NAME_ID,
            msg: $("#messageInput").val(),
            time: Date.now()
        });
        $("#messageInput").val("");
		var corpus = "chatldr.me/logs/Cat6.txt";
		var account_id = "aaronjhnstn7@gmail.com"
		var url = PREFIX + "/corpora/" +account_id +"/" +corpus +"/related_concepts"
		var concepts = $.get(url);
		console.log(concepts);
    }

    function loadMessages(snapshot) {
        if (snapshot.child("cmd").val() == "REFRESH") {
            if (Date.now() < snapshot.child("expire").val()) {
                location.reload(false);
            }
        } else if (snapshot.child("cmd").val() == "ALERT") {
            $("body").attr("style", "overflow: hidden;");
            $("body").append('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: red; text-align: center; color: white; z-index: 1000;"><h1>' + snapshot.child("alert").val() + '</h1></div>');
        } else if (snapshot.child("cmd").val() == "TARGET_ALERT" && snapshot.child("target").val() == NAME_ID) {
            $("body").attr("style", "overflow: hidden;");
            $("body").append('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: red; text-align: center; color: white; z-index: 1000;"><h1>' + snapshot.child("alert").val() + '</h1></div>')
        } else {
            if(snapshot.child("type").val() == "status") {
                if (NAME_ID == snapshot.child("name").val()) {
                $("#messages").append('<i><p class="outMessage">' + snapshot.child("name").val() + ' ' + snapshot.child("msg").val() + '</p></i>');
            } else {
                $("#messages").append('<i><p class="inMessage">' + snapshot.child("name").val() + ' ' + snapshot.child("msg").val() + '</p></i>');
            }
            } else {
                if (NAME_ID == snapshot.child("name").val()) {
                $("#messages").append('<p class="outMessage">' + snapshot.child("msg").val() + '</p>');
            } else {
                $("#messages").append('<p class="inMessage"><b>' + snapshot.child("name").val() + '</b> ' + snapshot.child("msg").val() + '</p>');
            }
            }
            
            $("#messages").stop();
            $("#messages").animate({
                scrollTop: $("#messages")[0].scrollHeight
            }, 400);
        }
    }

    function updatePeople(snapshot) {
        if (snapshot.val() == "true") {
            $("#peopleList").append('<p id="' + snapshot.key().replace(/\s+/g, '') + '">' + snapshot.key() + '</p>');
        } else {
            $("#peopleList > #" + snapshot.key().replace(/\s+/g, '')).remove();
        }
    }

    $("#messageInput").keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            submitMessage();
        }

    });

    $("#submitInput").click(submitMessage);

    $("#groupNameButton").click(function () {
        $("#peopleList").slideToggle(200);
    });

    $("#backButton").click(function () {
        window.location.href = "http://chatldr.me";
    });

    fb.child(GROUP_ID).child("messages").on("child_added", function (snapshot, prevChildKey) {
        loadMessages(snapshot);
    });

    fb.child(GROUP_ID).child("users").on("child_added", function (snapshot) {
        updatePeople(snapshot);
    });

    fb.child(GROUP_ID).child("users").on("child_changed", function (snapshot) {
        updatePeople(snapshot);
    });

});