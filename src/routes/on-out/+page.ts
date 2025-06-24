//TODO: LOAD ALL API DATA FOR WEATHER, AIR QUALITY, ETC
import { fetchWeatherApi } from 'openmeteo';

const params = {
    "latitude": 52.52,
    "longitude": 13.41,
    "current": ["temperature_2m", "relative_humidity_2m", "is_day", "precipitation", "cloud_cover", "pressure_msl", "wind_speed_10m"]
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const utcOffsetSeconds = response.utcOffsetSeconds();

const current = response.current()!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
    current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: current.variables(0)!.value(),
        relativeHumidity2m: current.variables(1)!.value(),
        isDay: current.variables(2)!.value(),
        precipitation: current.variables(3)!.value(),
        cloudCover: current.variables(4)!.value(),
        pressureMsl: current.variables(5)!.value(),
        windSpeed10m: current.variables(6)!.value(),
    },
};