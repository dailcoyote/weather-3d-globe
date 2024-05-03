import cloud from "../assets/indicators/cloud.png";
import clouds from "../assets/indicators/clouds.png";
import cloudLightning from "../assets/indicators/cloud_lightning.png";
import heavyRain from "../assets/indicators/heavy_rain.png";
import lightRain from "../assets/indicators/light_rain.png";
import lightSnow from "../assets/indicators/light_snow.png";
import partlyCloudyDay from "../assets/indicators/partly_cloudy_day.png";
import rainCloud from "../assets/indicators/rain_cloud.png";
import rainCloudLow from "../assets/indicators/rain_cloud_low.png";
import rain from "../assets/indicators/rain.png";
import sleet from "../assets/indicators/sleet.png";
import snow from "../assets/indicators/snow.png";
import snowStorm from "../assets/indicators/snow_storm.png";
import stormyWeather from "../assets/indicators/stormy_weather.png";
import sun from "../assets/indicators/sun.png";
import sunOriginal from "../assets/indicators/sun_original.png";

class WeatherIcons {
    static Cloud = cloud;
    static Clouds = clouds;
    static CloudLightning = cloudLightning;
    static HeavyRain = heavyRain;
    static LightRain = lightRain;
    static LightSnow = lightSnow;
    static PartlyCloudyDay = partlyCloudyDay;
    static RainCloud = rainCloud;
    static RainCloudLow = rainCloudLow;
    static Rain = rain;
    static Sleet = sleet;
    static Snow = snow;
    static SnowStorm = snowStorm;
    static StormyWeather = stormyWeather;
    static Sun = sun;
    static SunOriginal = sunOriginal;
}

class WeatherConditions {
    static Thunderstorm = new WeatherConditions({
        defaultAsset: WeatherIcons.StormyWeather
    });

    static Drizzle = new WeatherConditions({
        defaultAsset: WeatherIcons.Cloud
    });

    static Rain = new WeatherConditions({
        defaultAsset: WeatherIcons.Rain,
        linkedCodes: [{
            id: 500,
            asset: WeatherIcons.LightRain
        }, {
            id: 502,
            asset: WeatherIcons.HeavyRain
        }, {
            id: 503,
            asset: WeatherIcons.HeavyRain
        }, {
            id: 504,
            asset: WeatherIcons.HeavyRain
        }, {
            id: 520,
            asset: WeatherIcons.RainCloudLow
        }, {
            id: 522,
            asset: WeatherIcons.HeavyRain
        }, {
            id: 531,
            asset: WeatherIcons.HeavyRain
        }]
    })

    static Snow = new WeatherConditions({
        defaultAsset: WeatherIcons.Snow,
        linkedCodes: [{
            id: 600,
            asset: WeatherIcons.LightSnow
        }, {
            id: 601,
            asset: WeatherIcons.Snow
        }, {
            id: 602,
            asset: WeatherIcons.SnowStorm
        }, {
            id: 611,
            asset: WeatherIcons.Sleet
        }]
    });

    static Mist = new WeatherConditions({
        defaultAsset: WeatherIcons.CloudLightning
    })

    static Clear = new WeatherConditions({
        defaultAsset: WeatherIcons.Sun
    })

    static Clouds = new WeatherConditions({
        defaultAsset: WeatherIcons.Clouds
    })

    constructor(materials) {
        this.materials = materials;
    }

    findWeatherAsset(id) {
        const cond = Array.isArray(this.materials.linkedCodes) &&
            this.materials.linkedCodes.find((item) => item.id === id);

        if (!cond) {
            return this.materials.defaultAsset
        }

        return cond.asset;
    }
}

class TemperatureUnits {
    static Celsius = "°C";
    static Fahrenheit = "°F";
    static Kelvin = "K"
}

class MeasurementUnits {
    static convertFahrenheit2Celsius(F) {
        return ((F - 32) + 9/5).toFixed(2);
    }
    static convertCelsius2Fahrenheit(C) {
        return ((C * 1.8000) + 32).toFixed(2);
    }
    static convertMs2Mph(ms) {
        return (ms * 2.2369362921).toFixed(2);
    }
    static convertPascal2mmHg(pascal){
        return (pascal * 0.75006375541921).toFixed(2);
    }
}


export default {
    WeatherIcons,
    WeatherConditions,
    MeasurementUnits
};