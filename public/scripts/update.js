$("#back").click(function(){
  window.location.replace("/restaurants");
});

$('.form').on('submit', function () {
    var values = {};
    values['id'] = $('#id').val();
    values['name'] = $('#name').val();
    values['webPage'] = $('#webPage').val();
    values['number'] = $('#number').val();
    var address = {lat : $('#lat').val(), long : $('#long').val(), direction : $('#direction').val()};
    values['address'] = address;
    var schedules = [];
    for(var i = 1; i < 8; i++) {
      var openArray =  $('#open' + i).val().split(":");
      var closeArray = $('#close' + i).val().split(":");
      var dateOpen = new Date();
      var dateClose = new Date();
      dateOpen.setHours(openArray[0]);
      dateOpen.setMinutes(openArray[1]);
      dateClose.setHours(closeArray[0]);
      dateClose.setMinutes(closeArray[1]);
      var schedule = {day : getDay(i), open : dateOpen, close : dateClose}
      schedules.push(schedule);
    }
    values['schedules'] = schedules;
    updateRestaurant(values);
    return false;
});

function updateRestaurant(values) {
  $.ajax({
     type: "POST",
     url: "/changeRestaurant",
     async: false,
     data: {values},
     success: function(response) {
       if(response['code'] != 1) {
         alert(response['status']);
       }
       else {
         window.location.replace("/restaurants");
       }
     }
  });
}

function getDay(i) {
  switch(i) {
    case 1:
      return 'Lunes';
    case 2:
      return 'Martes';
    case 3:
      return 'Miercoles';
    case 4:
      return 'Jueves';
    case 5:
      return 'Viernes';
    case 6:
      return 'Sabado';
    default:
      return 'Domingo';
  }
}
