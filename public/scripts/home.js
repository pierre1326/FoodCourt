$("#logout").click(function(){
  $.ajax({
	   type: "GET",
	   url: "/logout",
	   async: false,
	   success: function(response) {
			 window.location.replace("/");
	   }
	});
});

$("#restaurant").click(function(){
	window.location.replace("/restaurants");
});

$("#user").click(function(){
	window.location.replace("/user");
});
