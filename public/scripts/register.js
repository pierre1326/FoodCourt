$("#register").click(function(){
	$.ajax({
	   type: "POST",
	   url: "/createAdmin",
	   async: false,
	   data: {user:$("#user").val(), password:$("#password").val()},
	   success: function(response) {
       if("error" in response) {
         alert(response['error']);
       }
       else {
         alert(response['status']);
       }
       $("#email").val("");
       $("#password").val("");
	   }
	});
});
