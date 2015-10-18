<script type="text/javascript">
    var fb = new Firebase("https://chatl-dr.firebaseio.com/");
    fb.set({
        title: "hello",
        users: "yuh"
    });
    $('#FacebookAuthentication').click(function runSort() {
        alert("hello");
    });
</script>