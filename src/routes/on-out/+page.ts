import { fetchWeatherApi } from 'openmeteo';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {

    const lat = url.searchParams.get('lat');
    const long = url.searchParams.get('long');

    const weatherData = await getWeather(lat!, long!);
    const airQualityData = await getAirQuality(lat!, long!);

    return {weatherData, airQualityData}
};


const getWeather = async (long: string, lat: string): Promise<WeatherData> => {
    const apiParams = {
        "latitude": lat,
        "longitude": long,
        "current": ["temperature_2m", "relative_humidity_2m", "is_day", "precipitation", "cloud_cover", "pressure_msl", "wind_speed_10m"]
    };

    const apiUrl = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(apiUrl, apiParams);

    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData: WeatherData = {
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

    return weatherData
}

const getAirQuality = async (long: string, lat: string): Promise<AirQualityData> => {
    const params = {
        "latitude": lat,
        "longitude": long,
        "current": ["dust", "pm10", "pm2_5"]
    };
    const url = "https://air-quality-api.open-meteo.com/v1/air-quality";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const airQualityData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            dust: current.variables(0)!.value(),
            pm10: current.variables(1)!.value(),
            pm25: current.variables(2)!.value(),
        },
    };

    return airQualityData
}