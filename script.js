async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherInfo = document.getElementById("weatherInfo");

  if (!city) {
    weatherInfo.innerHTML = "<p style='color:red;'>Please enter a city name.</p>";
    return;
  }

  try {
    // 1️⃣ Get latitude & longitude of city
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      weatherInfo.innerHTML = "<p style='color:red;'>City not found. Try again.</p>";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2️⃣ Fetch weather data
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const weatherData = await weatherResponse.json();

    if (!weatherData.current_weather) {
      weatherInfo.innerHTML = "<p style='color:red;'>Weather data not available.</p>";
      return;
    }

    const { temperature, windspeed, weathercode } = weatherData.current_weather;

    // 3️⃣ Display results
    weatherInfo.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p>🌡 Temperature: ${temperature} °C</p>
      <p>💨 Wind Speed: ${windspeed} km/h</p>
      <p>☁ Weather Code: ${weathercode}</p>
    `;
  } catch (error) {
    weatherInfo.innerHTML = "<p style='color:red;'>Error fetching data. Please try again.</p>";
    console.error(error);
  }
}
