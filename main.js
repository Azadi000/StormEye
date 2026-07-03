let apiKey = "1e3e8f230b6064d27976e41163a82b77";

navigator.geolocation.getCurrentPosition(async function (position) {
   
    try {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
      
        var map = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`)
        var userdata = await map.json();
        let loc = userdata[0].name;
        
        let url = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&`;
        let respond = await fetch(url + `q=${loc}&` + `appid=${apiKey}`);
        let data = await respond.json();

        console.log(data);
        
        // display current weather info
        let cityMain = document.getElementById("city-name");
        let cityTemp = document.getElementById("metric");
        let weatherMain = document.querySelectorAll("#weather-main");
        let mainHumidity = document.getElementById("humidity");
        let mainFeel = document.getElementById("feels-like");
        let weatherImg = document.querySelector(".weather-icon");
        let weatherImgs = document.querySelector(".weather-icons");
        let tempMinWeather = document.getElementById("temp-min-today");
        let tempMaxWeather = document.getElementById("temp-max-today");

        cityMain.innerHTML = data.city.name;
        cityTemp.innerHTML = Math.floor(data.list[0].main.temp) + "°";
        weatherMain[0].innerHTML = data.list[0].weather[0].description;
        weatherMain[1].innerHTML = data.list[0].weather[0].description;
        mainHumidity.innerHTML = Math.floor(data.list[0].main.humidity);
        mainFeel.innerHTML = Math.floor(data.list[0].main.feels_like);
        tempMinWeather.innerHTML = Math.floor(data.list[0].main.temp_min) + "°";
        tempMaxWeather.innerHTML = Math.floor(data.list[0].main.temp_max) + "°";

        let weatherCondition = data.list[0].weather[0].main.toLowerCase();

        if (weatherCondition === "rain") {
            weatherImg.src = "img/rain.jpg";
            weatherImgs.src = "img/rain.jpg";
        } else if (weatherCondition === "clear" || weatherCondition === "clear sky") {
            weatherImg.src = "img/sun.jpg";
            weatherImgs.src = "img/sun.jpg";
        } else if (weatherCondition === "snow") {
            weatherImg.src = "img/snow.jpg";
            weatherImgs.src = "img/snow.jpg";
        } else if (weatherCondition === "clouds" || weatherCondition === "smoke") {
            weatherImg.src = "img/cloud.jpg";
            weatherImgs.src = "img/cloud.jpg";
        } else if (weatherCondition === "mist" || weatherCondition === "Fog") {
            weatherImg.src = "img/mist.jpg";
            weatherImgs.src = "img/mist.jpg";
        } else if (weatherCondition === "haze") {
            weatherImg.src = "img/haze.jpg";
            weatherImgs.src = "img/haze.jpg";
        } else if (data.weather[0].main === "Thunderstorm") {
            weatherImg.src = "img/thunderstorm.jpg";
            weatherImgs.src = "img/thunderstorm.jpg";
        }

        // Fetch and display 5-day forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${data.city.name}&appid=${apiKey}&units=metric`;

        fetch(forecastUrl)
            .then(response => response.json())
            .then(data => {
                console.log("5-Day Forecast for", data.city.name);
                displayForecast(data);
            })
            .catch(error => {
                console.error("Error fetching forecast:", error);
            });

        function displayForecast(data) {
            const dailyForecasts = {};
            let forecast = document.getElementById('future-forecast-box');
            let forecastbox = "";

            data.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0];
                let dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                let day = new Date(date).getDay();

                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = {
                        day_today: dayName[day],
                        temperature: Math.floor(item.main.temp) + "°",
                        description: item.weather[0].description,
                        weatherImg: item.weather[0].main.toLowerCase()
                    };
                }
            });

            for (const date in dailyForecasts) {
                let imgSrc = "";

                switch (dailyForecasts[date].weatherImg) {
                    case "rain":
                        imgSrc = "img/rain.jpg";
                        break;
                    case "clear":
                    case "clear sky":
                        imgSrc = "img/sun.jpg";9
                        break;
                    case "snow":
                        imgSrc = "img/snow.jpg";
                        break;
                    case "clouds":
                    case "smoke":
                        imgSrc = "img/cloud.jpg";
                        break;
                    case "mist":
                        imgSrc = "img/mist.jpg";
                        break;
                    case "haze":
                        imgSrc = "img/haze.jpg";
                        break;
                    case "thunderstorm":
                        imgSrc = "img/thunderstorm.jpg";
                        break;
                    default:
                        imgSrc = "img/sun.jpg";
                }

                forecastbox += `
                <div class="weather-forecast-box">
                <div class="day-weather">
                <span>${dailyForecasts[date].day_today}</span>
                 </div>
                    <div class="weather-icon-forecast">
                        <img src="${imgSrc}" />
                    </div>
                    <div class="temp-weather">
                        <span>${dailyForecasts[date].temperature}</span>
                    </div>
                    <div class="weather-main-forecast">${dailyForecasts[date].description}</div>
                </div>`;
            }

            forecast.innerHTML = forecastbox;

            console.log(data);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
},
() => {
    // Handle location retrieval error
    alert("Please turn on your location and refresh the page");
  
