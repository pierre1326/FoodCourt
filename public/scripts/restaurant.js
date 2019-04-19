$("#back").click(function(){
  window.location.replace("/home");
});

function deleteRestaurant(element) {
  $.ajax({
	   type: "POST",
	   url: "/deleteRestaurant",
	   async: false,
	   data: {id : $(element).data("value")},
	   success: function(response) {
       if(response["code"] != 1) {
         alert(response["status"]);
       }
       else {
         window.location.replace("/restaurants");
       }
	   }
	});
}

function updateRestaurant(element) {
  window.location.replace("/update/" + $(element).data("value"));
}
