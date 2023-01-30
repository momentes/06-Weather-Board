
const cities = [];

const citySearch=document.getElementById("citySearch");

const searchInput=document.getElementById("searchInput");
const searchDisplay = document.getElementById("searchDisplay");
const previousSearches = document.getElementById("previousSearches");

const currentCastDashboard=document.getElementById("currentCastDashboard");

const forecastHeader = document.getElementById("forecastHeader");
const foreastList = document.getElementById("forecastList");

const clearHistory = document.getElementById("clearHistory");


function toAllCaps(str){
    return str.toUpperCase();
}

function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
} 


const saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};


clearHistory.addEventListener("click", function(){
    localStorage.removeItem("cities");
    previousSearches.textContent = "";
});


const formSumbitHandler = function(event){
    event.preventDefault();
    const cityCountry = searchInput.value.trim();
    if(cityCountry){
        const cityCountryArray = cityCountry.split(',');
        const city = cityCountryArray[0].trim();
        const country = cityCountryArray[1] ? cityCountryArray[1].trim() : '';
        if (country) {
          getCurrentCast(city, country);
          getForecast(city, country);
          cities.unshift({city, country});
        } else {
          getCurrentCast(city);
          getForecast(city);
          cities.unshift({city});
        }
        searchInput.value = "";
        saveSearch();
        previousSearch(city, country);
    } else{
        searchInput.placeholder = "Please enter a city, country";
    }
}


const previousSearch = function(previousSearchCity, previousSearchCountry){
 
    previousSearchListElement = document.createElement("button");
    previousSearchListElement.textContent = toTitleCase(previousSearchCity) + ' ' + toAllCaps(previousSearchCountry);
    previousSearchListElement.classList = "d-flex w-100 btn-light border p-2";
    previousSearchListElement.setAttribute("previousSearchCity",previousSearchCity)
    previousSearchListElement.setAttribute("previousSearchCountry",previousSearchCountry)
    previousSearchListElement.setAttribute("type", "submit");

    previousSearches.prepend(previousSearchListElement);
}



var pastSearchHandler = function(event){
    var city = event.target.getAttribute("previousSearchCity")
    if(city){
        getCurrentCast(city);
        getForecast(city);
    }
}


const getCurrentCast = function(city, country){
    let apiKey = "523b55d0fba1e533fc90809576b9db58"
    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`
 
     fetch(apiURL)
     .then(function(response){
         response.json().then(function(data){
             currectCastDirectory(data, city);
         });
     });
 };


 const currectCastDirectory = function(weather, currentCity){
    
    //Clear Search
    currentCastDashboard.textContent= "";  
    searchDisplay.textContent = toTitleCase(currentCity);
    
    //Create Header Element 
    let country = document.createElement("span")
    country.textContent = ", " + weather.sys.country;
 
    let currentDate = document.createElement("span")
    currentDate.textContent=" (" + moment(weather.dt.value).format("MMMM D, YYYY") + ") ";
 
    let weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
 
    //Create Description Element
    let description = document.createElement("span");
    description.textContent = "Description: " + toTitleCase(weather.weather[0].description);
    description.classList = "list-group-item"
 
    let temperatureFeels = document.createElement("span");
    temperatureFeels.textContent = "Feels Like: " + weather.main.feels_like + " °C";
    temperatureFeels.classList = "list-group-item"
 
    let temperature = document.createElement("span");
    temperature.textContent = "Temperature: " + weather.main.temp + " °C";
    temperature.classList = "list-group-item"
   
    let humidity = document.createElement("span");
    humidity.textContent = "Humidity: " + weather.main.humidity + " %";
    humidity.classList = "list-group-item"
 
    let windSpeed = document.createElement("span");
    windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeed.classList = "list-group-item"
 
    //Append Header Element
    searchDisplay.appendChild(country);
    searchDisplay.appendChild(currentDate);
    searchDisplay.appendChild(weatherIcon);
 
    //Append Description Element
    currentCastDashboard.appendChild(description);
    currentCastDashboard.appendChild(temperatureFeels);
    currentCastDashboard.appendChild(temperature);
    currentCastDashboard.appendChild(humidity);
    currentCastDashboard.appendChild(windSpeed);
  
 }
 

const getForecast = function(city, country){
    let apiKey = "523b55d0fba1e533fc90809576b9db58"
    let apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           forecastDirectory(data);
        });
    });
};


const forecastDirectory = function(weather){
    foreastList.textContent = ""
    forecastHeader.textContent = "5 Day Forecast Weather:";

    const forecast = weather.list;
       for(var i=5; i < forecast.length; i=i+8){
       const dailyForecast = forecast[i];
        
       
       const forecastItem=document.createElement("div");
       forecastItem.classList = "card bg-primary text-light m-2";

       let forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"

       let weatherIcon = document.createElement("img")
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
       weatherIcon.classList = "card-body text-center";

       let forecastDescription=document.createElement("span");
       forecastDescription.textContent = toTitleCase(dailyForecast.weather[0].description);
       forecastDescription.classList = "card-body text-center";

       let forecastFeels=document.createElement("span");
       forecastFeels.textContent = "Feels Like: " + dailyForecast.main.feels_like + " °C";
       forecastFeels.classList = "card-body text-center";

       let forecastTemperature=document.createElement("span");
       forecastTemperature.textContent = "Temperature: " + dailyForecast.main.temp + " °C";
       forecastTemperature.classList = "card-body text-center";

       let forecastHumidity=document.createElement("span");
       forecastHumidity.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";
       forecastHumidity.classList = "card-body text-center";


       forecastItem.appendChild(forecastDate);
       forecastItem.appendChild(weatherIcon);
       forecastItem.appendChild(forecastDescription);
       forecastItem.appendChild(forecastFeels);
       forecastItem.appendChild(forecastTemperature);
       forecastItem.appendChild(forecastHumidity);
       

        foreastList.appendChild(forecastItem);
    }

}


citySearch.addEventListener("submit", formSumbitHandler);
previousSearches.addEventListener("click", pastSearchHandler);