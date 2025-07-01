type WeatherDataCurrent = {
    time: Date;
    temperature2m: number;
    relativeHumidity2m: number;
    isDay: number;
    precipitation: number;
    cloudCover: number;
    pressureMsl: number;
    windSpeed10m: number;
}

type AirQualityCurrent = {
    time: Date;
    dust: number;
    pm10: number;
    pm25: number;
}

type WeatherData = {
    current: WeatherDataCurrent
}

type AirQualityData = {
    current: AirQualityCurrent
}