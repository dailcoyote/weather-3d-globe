const VITE_APP_OPEN_WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
const VITE_APP_OPEN_WEATHER_APPID = "586faf4989d390ec0695f6e861f9d76c";

class OpenWeatherMap {
    async fetchForecastWeatherData(lat, lon, units) {
        const params = {
            lat,
            lon,
            units,
            appid: VITE_APP_OPEN_WEATHER_APPID
        };
        const options = {
            method: 'GET'
        };
        let url = VITE_APP_OPEN_WEATHER_API;

        url += '?' + ( new URLSearchParams( params ) ).toString();

        const response = await fetch(url, options);
        return response.json();
    }
}

export default new OpenWeatherMap();