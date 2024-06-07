// Fetch weather api from openweathermap.com //

let weather = {
    apiKey: "b3413db4eda485bcd9882f7680aadebb",
    fetchWeather(city) {
        let url;
        if (typeof city === "string") {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`;
        } else {
            const { lat, lon } = city;
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
        }
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => {
                console.log("data", data);
                this.displayWeather(data);
            });
    },

// Display weather text content //

    displayWeather(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, pressure } = data.main;
        const { speed } = data.wind;

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText =
            "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText =
            "Wind speed: " + speed + " km/h";
        document.querySelector(".pressure").innerText =
            "Pressure: " + pressure + " mb";
        document.querySelector(".weather").classList.remove("loading");

// Set background image based on weather condition //

        let backgroundImage;
        if (description.toLowerCase().includes("rain")) {
            backgroundImage = "url('https://source.unsplash.com/1600x900/?rain')";
        } else if (description.toLowerCase().includes("cloud")) {
            backgroundImage = "url('https://source.unsplash.com/1600x900/?cloudy')";
        } else if (description.toLowerCase().includes("haze")) {
            backgroundImage = "url('https://source.unsplash.com/1600x900/?haze')";
        } else if (description.toLowerCase().includes("thunderstrom")) {
            backgroundImage = "url('https://source.unsplash.com/1600x900/?thunder')";
        } else if (description.toLowerCase().includes("clear sky")) {
            backgroundImage = "url('https://source.unsplash.com/1600x900/?clear-sky')";
        } else if (description.toLowerCase().includes("smoke")) {
            backgroundImage = "url('https://source.unsplash.com/1600x900/?haze')";
        } else {
            backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
        }
        document.body.style.backgroundImage = backgroundImage;
    },
    search() {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    };
                    this.fetchWeather(coords);
                },
                (error) => {
                    alert("Unable to find your location. Please try again later.");
                    console.error(error);
                }
            );
        } else {
            alert("Geolocation is not supported.");
        }
    },
};

document.querySelector(".search button").addEventListener("click", () => {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        weather.search();
    }
});

weather.getCurrentLocation();
