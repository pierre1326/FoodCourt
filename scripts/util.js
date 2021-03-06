function distance(x1, y1, x2, y2) {
  return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
}

function convert(distance) {
  return distance * values['factor'];
}

function checkArray(array, type) {
  if(array == undefined) {
    return false;
  }
  for(i in array) {
    if(typeof array[i] != type) {
      return false;
    }
  }
  return true;
}

function checkSchedules(array) {
  if(array == undefined || array.length != 7) {
    return false;
  }
  for(i in array) {
    var schedule = array[i];
    var open = new Date(schedule.open);
    var close = new Date(schedule.close);
    if(typeof schedule.day != "string" || !(open instanceof Date && !isNaN(open.valueOf())) ||  !(close instanceof Date && !isNaN(close.valueOf()))) {
      return false;
    }
  }
  return true;
}

function checkOpinion(opinion) {
  if(opinion.calification != undefined && typeof opinion.calification === "number") {
    if(opinion.price != undefined && typeof opinion.price === "number") {
      var date = new Date(opinion.date);
      if(date instanceof Date && !isNaN(date.valueOf())) {
        if((opinion.comment != undefined && opinion.comment.length > 0) || opinion.comment == undefined) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkRestaurant(restaurant, filters) {
  if(filters.price != undefined) {
    if(restaurant.price < filters.price.min || restaurant.price > filters.price.max) {
      return false;
    }
  }
  if(filters.calification != undefined) {
    if(restaurant.calification < filters.calification.min || restaurant.calification > filters.calification.max) {
      return false;
    }
  }
  if(filters.ubication != undefined) {
    var totalDistance = distance(restaurant.address.lat, restaurant.address.long, filters.ubication.lat, filters.ubication.long);
    var kmDistance = convert(totalDistance);
    if(kmDistance > filters.ubication.distance) {
      return false;
    }
  }
  if(filters.foods != undefined) {
    for(i in filters.foods) {
      var flag = true;
      var food = filters.foods[i];
      if(restaurant.foods.includes(food)) {
        flag = false;
      }
      if(flag) {
        return false;
      }
    }
  }
  return true;
}

function checkFilters(filters) {
  if(filters.price != undefined) {
    if((typeof filters.price.min !== "number") || (typeof filters.price.max !== "number")) {
      return false;
    }
  }
  if(filters.calification != undefined) {
    if((typeof filters.calification.min !== "number") || (typeof filters.price.max !== "number")) {
      return false;
    }
  }
  if(filters.ubication != undefined) {
    if((typeof filters.ubication.lat !== "number") || (typeof filters.ubication.long !== "number") || (typeof filters.ubication.distance !== "number")) {
      return false;
    }
  }
  if(filters.foods != undefined) {
    for(i in filters.foods) {
      if(typeof filters.foods[i] !== "string") {
        return false;
      }
    }
  }
  return true;
}

function updateRestaurant(restaurant, callback) {
  var restaurants = models['Restaurants'];
  restaurants.findOne({"_id" : restaurant}, {opinions : 1}).exec(function(err, arrayOpinions) {
    if(err) {
      var error = {error : "Error with database"};
      callback(error);
    }
    else {
      arrayOpinions = arrayOpinions['opinions'];
      var array = {$in : arrayOpinions};
      var opinions = models['Opinions'];
      opinions.find({"_id" : array}).exec(function(err, values) {
        if(err) {
          var error = {error : "Error with database"};
          callback(error);
        }
        else {
          var price = 0;
          var calification = 0;
          var total = 0;
          for(i in values) {
            price += values[i]['price'];
            calification += values[i]['calification'];
            total++;
          }
          price /= total;
          calification /= total;
          var set = {price : price, calification : calification};
          restaurants.updateOne({"_id" : restaurant}, {$set : set}, function(err, restaurant) {
            if(err) {
              var error = {error : "Error with database"};
              callback(error);
            }
            else {
              var status = {status : "Opinion added"};
              callback(status);
            }
          });
        }
      });
    }
  });
}

module.exports = { distance, convert, checkArray, checkSchedules, checkOpinion, checkRestaurant, updateRestaurant, checkFilters };
