// API Configuration
const config = {
    // OpenWeather API
    openWeather: {
        apiKey: '916bb6e7396cb26db380c3c0fc0fd0dd', // Your OpenWeather API key
        baseUrl: 'https://api.openweathermap.org/data/2.5',
        endpoints: {
            weather: '/weather',
            forecast: '/forecast'
        }
    },

    // NASA APIs
    nasa: {
        apiKey: 'LBEBIdF6mbkgSSSQu70OfKztVRkqLNHSBAhFSUga', // NASA API key
        baseUrl: 'https://api.nasa.gov',
        endpoints: {
            apod: '/planetary/apod',
            neows: '/neo/rest/v1/feed',
            iss: '/api/iss-pass',
            planets: '/planetary/positions'
        }
    }
};

// IMPORTANT: Do not commit API keys to your repository. Use environment variables instead.

export default config; 