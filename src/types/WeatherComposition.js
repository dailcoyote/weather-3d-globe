class WeatherIcons {
    static Cloud = "./indicators/cloud.png";
    static Clouds = "./indicators/clouds.png";
    static CloudLightning = "./indicators/cloud_lightning.png";
    static HeavyRain = "./indicators/heavy_rain.png";
    static LightRain = "./indicators/light_rain.png";
    static LightSnow = "./assets/indicators/light_snow.png";
    static PartlyCloudyDay = "./indicators/partly_cloudy_day.png";
    static RainCloud = "./assets/indicators/rain_cloud.png";
    static RainCloudLow = "./indicators/rain_cloud_low.png";
    static Rain = "./indicators/rain.png";
    static Sleet = "./indicators/sleet.png";
    static Snow = "./indicators/snow.png";
    static SnowStorm = "./indicators/snow_storm.png";
    static StormyWeather = "./indicators/stormy_weather.png";
    static Sun = "./indicators/sun.png";
    static SunOriginal = "./indicators/sun_original.png";
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