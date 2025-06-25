import { fetchWeatherApi } from 'openmeteo';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {

    const lat = url.searchParams.get('lat');
    const long = url.searchParams.get('long');

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
};