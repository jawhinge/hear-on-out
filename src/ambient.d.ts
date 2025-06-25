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

type WeatherData = {
    current: WeatherDataCurrent
}