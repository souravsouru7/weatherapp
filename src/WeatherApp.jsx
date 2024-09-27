import React, { useState } from 'react';
import axios from 'axios';
import { Search, Cloud, CloudRain, Sun, Wind, Droplets, ThermometerSun } from 'lucide-react';

const API_KEY = 'aec0dc463cd49ad7ebaa2bda05cd0f58'; // Replace with your OpenWeatherMap API key
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });
      setWeather(response.data);
      setError('');
    } catch (err) {
      setWeather(null);
      setError('Failed to fetch weather data. Please check the city name.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather();
    }
  };

  const getWeatherIcon = (description) => {
    if (description.includes('rain')) return <CloudRain className="w-24 h-24 text-blue-300" />;
    if (description.includes('cloud')) return <Cloud className="w-24 h-24 text-gray-300" />;
    return <Sun className="w-24 h-24 text-yellow-300" />;
  };

  const getBackgroundColor = (temp) => {
    if (temp < 10) return 'from-blue-400 to-blue-600';
    if (temp < 20) return 'from-green-400 to-blue-500';
    return 'from-orange-400 to-red-500';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-600 p-4">
      <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center text-white mb-8">Weather App</h1>
          <form onSubmit={handleSubmit} className="flex mb-8">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="flex-grow px-4 py-3 text-gray-800 bg-white bg-opacity-50 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-r-full hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Searching...' : <Search className="w-6 h-6" />}
            </button>
          </form>
          {error && <p className="text-red-300 text-center mb-4">{error}</p>}
          {weather && (
            <div className={`text-center p-6 rounded-2xl bg-gradient-to-br ${getBackgroundColor(weather.main.temp)}`}>
              <h2 className="text-3xl font-semibold text-white mb-4">{weather.name}, {weather.sys.country}</h2>
              <div className="flex justify-center items-center mb-6">
                {getWeatherIcon(weather.weather[0].description)}
                <p className="text-6xl font-bold text-white ml-4">{Math.round(weather.main.temp)}°C</p>
              </div>
              <p className="text-xl text-white mb-6 capitalize">{weather.weather[0].description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-30 p-4 rounded-xl">
                  <Droplets className="w-8 h-8 text-blue-200 mx-auto mb-2" />
                  <p className="text-sm text-blue-100">Humidity</p>
                  <p className="text-2xl font-semibold text-white">{weather.main.humidity}%</p>
                </div>
                <div className="bg-white bg-opacity-30 p-4 rounded-xl">
                  <Wind className="w-8 h-8 text-blue-200 mx-auto mb-2" />
                  <p className="text-sm text-blue-100">Wind Speed</p>
                  <p className="text-2xl font-semibold text-white">{weather.wind.speed} m/s</p>
                </div>
                <div className="bg-white bg-opacity-30 p-4 rounded-xl">
                  <ThermometerSun className="w-8 h-8 text-yellow-200 mx-auto mb-2" />
                  <p className="text-sm text-blue-100">Feels Like</p>
                  <p className="text-2xl font-semibold text-white">{Math.round(weather.main.feels_like)}°C</p>
                </div>
                <div className="bg-white bg-opacity-30 p-4 rounded-xl">
                  <Sun className="w-8 h-8 text-yellow-200 mx-auto mb-2" />
                  <p className="text-sm text-blue-100">Max Temp</p>
                  <p className="text-2xl font-semibold text-white">{Math.round(weather.main.temp_max)}°C</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;