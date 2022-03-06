var locationList =$("#city-list");
var cities = [];
var key = "fc8bffadcdca6a94d021c093eac22797";

// create current day
function FormatDay(date){
    var date = new Date();
    var month = date.getMonth()+1;
    var day = date.getDate();
    
    var dayOutput = date.getFullYear() + '/' +
        (month<10 ? '0' : '') + month + '/' +
        (day<10 ? '0' : '') + day;
    return dayOutput;
}

// call localstorage function and create storing and rendering functions.
funlocalStorage();

function funlocalStorage() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        cities = storedCities;
      }
    renderCities();
}

function storeCities() {
  localStorage.setItem("cities", JSON.stringify(cities));
}

function renderCities() {
    locationList.empty();
    
    // Rendering a new list for each city
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      
      var li = $("<li>").text(city);
      li.attr("id","listC");
      li.attr("data-city", city);
      li.attr("class", "list-group-item");
      locationList.prepend(li);
    }
    if (!city){
        return
    } 
    else{
        getResponseWeather(city)
    };
}   

  // submit form
  $("#add-city").on("click", function(event){
      event.preventDefault();

    var city = $("#city-input").val().trim();
    
    if (city === "") {
        return;
    }
    cities.push(city);
  storeCities();
  renderCities();
  });
  
  // gets weather response function
  function getResponseWeather(cityName) {
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName+ "&appid=" + key; 

    // clear  
    $("#today-weather").empty();
    $.ajax({
      url: apiURL,
      method: "GET"
    }).then(function(response) {
        
      // creates a new rows of elements including temperature, humidity, and wind speed
      cityTitle = $("<h3>").text(response.name + " "+ FormatDay());
      $("#today-weather").append(cityTitle);
      var tempDelta = parseInt((response.main.temp)* 9/5 - 459);
      var cityTemperature = $("<p>").text("Temperature: "+ tempDelta + " °F");
      $("#today-weather").append(cityTemperature);
      var cityHumidity = $("<p>").text("Humidity: "+ response.main.humidity + " %");
      $("#today-weather").append(cityHumidity);
      var cityWindSpeed = $("<p>").text("Wind Speed: "+ response.wind.speed + " MPH");
      $("#today-weather").append(cityWindSpeed);
      var CoordLon = response.coord.lon;
      var CoordLat = response.coord.lat;
    
        // UV index
        var apiURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid="+ key+ "&lat=" + CoordLat +"&lon=" + CoordLon;
        $.ajax({
            url: apiURL2,
            method: "GET"
        }).then(function(responseuv) {
            var cityUV = $("<span>").text(responseuv.value);
            var cityUVp = $("<p>").text("UV Index: ");
            cityUVp.append(cityUV);
            $("#today-weather").append(cityUVp);
            if(responseuv.value > 0 && responseuv.value <=2){
            
            }
        });
    
        // 5 day forcast API code  
        var apiURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key;
            $.ajax({
            url: apiURL3,
            method: "GET"
        }).then(function(response5day) { 
            $("#boxes").empty();
            for(var i=0, j=0; j<=5; i=i+6){
                var read_date = response5day.list[i].dt;
                if(response5day.list[i].dt != response5day.list[i+1].dt){
                    var fiveDayDiv = $("<div>");
                    fiveDayDiv.attr("class","col-3 m-2 bg-primary")
                    var d = new Date(0); 
                    d.setUTCSeconds(read_date);
                    var date = d;
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var dayOutput = date.getFullYear() + '/' +
                    (month<10 ? '0' : '') + month + '/' +
                    (day<10 ? '0' : '') + day;
                    var fiveDayFore = $("<h6>").text(dayOutput);
                    //Set images as sources
                    var imgSRC = $("<img>");
                    var skyType = response5day.list[i].weather[0].main;
                    if(skyType==="Clouds"){
                        imgSRC.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
                    } else if(skyType==="Clear"){
                        imgSRC.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
                    }else if(skyType==="Rain"){
                        imgSRC.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
                    }

                    var pTemperatureK = response5day.list[i].main.temp;
                    var tempDelta = parseInt((pTemperatureK)* 9/5 - 459);
                    var tempFaren = $("<p>").text("Temperature: "+ tempDelta + " °F");
                    var humidity = $("<p>").text("Humidity: "+ response5day.list[i].main.humidity + " %");
                    fiveDayDiv.append(fiveDayFore);
                    fiveDayDiv.append(imgSRC);
                    fiveDayDiv.append(tempFaren);
                    fiveDayDiv.append(humidity);
                    $("#boxes").append(fiveDayDiv);
                    j++;
                }
        }
    });
    });
  }
  $(document).on("click", "#listC", function() {
    var thisCity = $(this).attr("data-city");
    getResponseWeather(thisCity);
  });