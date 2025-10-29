import React, { useState } from "react";
import { motion } from "framer-motion";

const WeatherNow = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }
    setError("");
    setLoading(true);
    setWeather(null);

    try {
      // Step 1: Get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found.");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Step 2: Get weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        name,
        country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        weathercode: weatherData.current_weather.weathercode,
        time: weatherData.current_weather.time,
      });
    } catch (err) {
      setError("Unable to fetch weather data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const weatherIcons = {
    0: "☀️ Clear sky",
    1: "🌤️ Mainly clear",
    2: "⛅ Partly cloudy",
    3: "☁️ Overcast",
    45: "🌫️ Fog",
    48: "🌫️ Depositing rime fog",
    51: "🌦️ Light drizzle",
    53: "🌧️ Moderate drizzle",
    55: "🌧️ Heavy drizzle",
    61: "🌧️ Light rain",
    63: "🌧️ Moderate rain",
    65: "🌧️🌧️ Heavy rain",
    66: "🌨️❄️ Light freezing rain",
    67: "🌨️❄️💧 Heavy freezing rain",
    71: "🌨️ Light snow",
    73: "🌨️ Moderate snow",
    75: "🌨️❄️❄️ Heavy snow",
    77: "🌨️ Snow grains",
    80: "🌦️ Rain showers",
    81: "🌦️ Moderate rain showers",
    82: "🌧️💧 Heavy rain showers",
    95: "⛈️ Thunderstorm",
    96: "⛈️🌨️ Thunderstorm with hail",
    99: "⛈️🌨️ Heavy thunderstorm with hail",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 via-blue-500 to-blue-700 text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/15 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center border border-white/20"
      >
        <h1 className="text-5xl font-extrabold mb-8 tracking-wide drop-shadow-lg">
          🌦️ Weather Now
        </h1>
        <div className="flex justify-center items-center gap-2 mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-2/3 md:w-3/4 p-3 rounded-xl text-gray-900 text-lg focus:ring-4 focus:ring-blue-300 outline-none border border-gray-200 shadow-md bg-white"
          />
          <button
            onClick={getWeather}
            className="bg-green-500 hover:bg-green-600 transition-all duration-300 px-5 py-3 rounded-xl font-semibold shadow-md text-white text-lg"
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="text-lg animate-pulse">Fetching weather data...</p>
        )}
        {error && <p className="text-red-300 font-medium">{error}</p>}

        {weather && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/20 rounded-2xl mt-8 p-6 shadow-inner border border-white/10"
          >
            <h2 className="text-3xl font-semibold mb-2">
              {weather.name}, {weather.country}
            </h2>
            <p className="text-xl mb-2 font-medium">
              {weatherIcons[weather.weathercode] || "🌍 Weather Info"}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 text-lg">
              <p className="bg-white/10 rounded-lg px-4 py-2 shadow-md">
                🌡️ {weather.temperature}°C
              </p>
              <p className="bg-white/10 rounded-lg px-4 py-2 shadow-md">
                💨 {weather.windspeed} km/h
              </p>
            </div>
            <p className="text-sm opacity-80 mt-4">
              ⏰{" "}
              {new Date(`${weather.time}Z`).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </motion.div>
        )}
      </motion.div>

      <footer className="mt-8 text-sm opacity-80 tracking-wide">
        Built for <span className="font-semibold">Jamie</span> — Outdoor
        Enthusiast 🌍
      </footer>
    </div>
  );
};

export default WeatherNow;
