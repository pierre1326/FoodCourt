$("#signUp").click(function(){
	$.ajax({
	   type: "POST",
	   url: "/loginAdmin",
	   async: false,
	   data: {user:$("#user").val(), password:$("#password").val()},
	   success: function(response) {
       if("error" in response) {
         alert(response['error']);
       }
       else if(response['code'] != 1) {
         alert(response['status']);
       }
       else {
         window.location.replace("/home");
       }
       $("#email").val("");
       $("#password").val("");
	   }
	});
});

$("#signIn").click(function(){
	window.location.replace("/create");
});
