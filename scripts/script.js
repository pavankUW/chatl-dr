$('#Create').click(function(){
	alert("hello");
	var Name = ($('#Name').val());
	var Room = ($('#Room').val())
	var Pass =($('#Pass').val())
	var x = "Chatldr.me?Action=Create?Name=" + Name + "?Room="+ Room + "?Pass=" + Pass ;
	console.log(x);
});
$('#Join').click(function(){
	var Name = ($('#Name').val());
	var Room = ($('#Room').val())
	var Pass =($('#Pass').val())
});