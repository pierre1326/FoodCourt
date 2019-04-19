$("#signUp").click(function(){
	$.ajax({
	   type: "POST",
	   url: "/loginAdmin",
	   async: false,
	   data: {user:$("#user").val(), password:$("#password").val()},
	   success: function(response) {
			 window.location.replace("/home");
	   }
	});
});

$("#signIn").click(function(){
	window.location.replace("/create");
});
