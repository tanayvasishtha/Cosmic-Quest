import config from './config.js';

class APIService {
    constructor() {
        this.openWeatherConfig = config.openWeather;
        this.nasaConfig = config.nasa;
    }

    async getWeather(lat, lon) {
        const url = `${this.openWeatherConfig.baseUrl}${this.openWeatherConfig.endpoints.weather}?lat=${lat}&lon=${lon}&appid=${this.openWeatherConfig.apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }
        return response.json();
    }

    async getSkyConditions(lat, lon) {
        const weather = await this.getWeather(lat, lon);
        return {
            isClear: weather.clouds.all < 30 && weather.visibility > 10000,
            cloudCover: weather.clouds.all,
            visibility: weather.visibility,
            conditions: weather.weather[0].description
        };
    }

    async getAstronomyPictureOfDay() {
        const url = `${this.nasaConfig.baseUrl}${this.nasaConfig.endpoints.apod}?api_key=${this.nasaConfig.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('APOD data fetch failed');
        }
        return response.json();
    }

    async getISSPassTimes(lat, lon) {
        const url = `${this.nasaConfig.endpoints.iss}?lat=${lat}&lon=${lon}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('ISS data fetch failed');
            return await response.json();
        } catch (e) {
            // Fallback demo data for hackathon/demo
            return {
                response: [
                    { risetime: Math.floor(Date.now() / 1000) + 3600, duration: 600 },
                    { risetime: Math.floor(Date.now() / 1000) + 7200, duration: 480 },
                    { risetime: Math.floor(Date.now() / 1000) + 10800, duration: 540 }
                ]
            };
        }
    }
}

const apiService = new APIService();
export default apiService; 