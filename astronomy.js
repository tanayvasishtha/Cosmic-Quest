// If you need config, uncomment the next line:
// import config from './config.js';

// Astronomy Calculations and Data
class AstronomyManager {
    constructor() {
        this.planets = {
            mercury: { name: 'Mercury', symbol: '☿', magnitude: -1.9 },
            venus: { name: 'Venus', symbol: '♀', magnitude: -4.4 },
            mars: { name: 'Mars', symbol: '♂', magnitude: -2.9 },
            jupiter: { name: 'Jupiter', symbol: '♃', magnitude: -2.7 },
            saturn: { name: 'Saturn', symbol: '♄', magnitude: 0.7 }
        };

        this.constellations = [
            { name: 'Ursa Major', commonName: 'Big Dipper', stars: 7 },
            { name: 'Orion', commonName: 'The Hunter', stars: 7 },
            { name: 'Cassiopeia', commonName: 'The Queen', stars: 5 },
            { name: 'Cygnus', commonName: 'Northern Cross', stars: 9 },
            { name: 'Leo', commonName: 'The Lion', stars: 9 }
        ];

        this.moonPhases = [
            'New Moon',
            'Waxing Crescent',
            'First Quarter',
            'Waxing Gibbous',
            'Full Moon',
            'Waning Gibbous',
            'Last Quarter',
            'Waning Crescent'
        ];
    }

    // Calculate moon phase
    calculateMoonPhase(date = new Date()) {
        const LUNAR_MONTH = 29.530588853; // days
        const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z');

        const days = (date - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
        const phase = ((days % LUNAR_MONTH) / LUNAR_MONTH) * 8;

        return this.moonPhases[Math.floor(phase)];
    }

    // Calculate sunrise and sunset times
    calculateSunTimes(latitude, longitude, date = new Date()) {
        // Simplified calculation (in a real app, use a proper astronomical library)
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const declination = -23.45 * Math.cos((360 / 365) * (dayOfYear + 10) * Math.PI / 180);

        const sunriseHour = 6 + (declination / 15);
        const sunsetHour = 18 - (declination / 15);

        return {
            sunrise: new Date(date.setHours(sunriseHour, 0, 0)),
            sunset: new Date(date.setHours(sunsetHour, 0, 0))
        };
    }

    // Get visible planets for a given date and location
    getVisiblePlanets(latitude, longitude, date = new Date()) {
        // In a real app, this would use proper astronomical calculations
        // This is a simplified version for demonstration
        const visiblePlanets = [];

        for (const [key, planet] of Object.entries(this.planets)) {
            // Simplified visibility check (in reality, this would be more complex)
            const isVisible = Math.random() > 0.3; // 70% chance of visibility

            if (isVisible) {
                visiblePlanets.push({
                    ...planet,
                    altitude: Math.random() * 90, // Random altitude between 0 and 90 degrees
                    azimuth: Math.random() * 360 // Random azimuth between 0 and 360 degrees
                });
            }
        }

        return visiblePlanets;
    }

    // Get constellation information
    getConstellationInfo(constellationName) {
        return this.constellations.find(c =>
            c.name.toLowerCase() === constellationName.toLowerCase() ||
            c.commonName.toLowerCase() === constellationName.toLowerCase()
        );
    }

    // Calculate star visibility based on light pollution
    calculateStarVisibility(lightPollution) {
        // Simplified calculation (in a real app, use proper astronomical data)
        const baseMagnitude = 6.0; // Naked eye limit in perfect conditions
        const visibilityLimit = baseMagnitude - (lightPollution / 2);

        return {
            nakedEye: Math.max(0, visibilityLimit),
            binoculars: Math.max(0, visibilityLimit + 2),
            telescope: Math.max(0, visibilityLimit + 5)
        };
    }

    // Get ISS pass times (simplified)
    async getISSPassTimes(latitude, longitude) {
        try {
            const response = await fetch(
                `https://api.nasa.gov/iss-pass.json?lat=${latitude}&lon=${longitude}&api_key=${NASA_API_KEY}`
            );
            const data = await response.json();

            return data.response.map(pass => ({
                risetime: new Date(pass.risetime * 1000),
                duration: pass.duration,
                magnitude: -3.0 // ISS typical magnitude
            }));
        } catch (error) {
            console.error('Error fetching ISS data:', error);
            return [];
        }
    }

    // Calculate optimal viewing conditions
    calculateViewingConditions(weatherData) {
        const conditions = {
            cloudCover: weatherData.clouds.all,
            visibility: weatherData.visibility,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed
        };

        let score = 100;

        // Reduce score based on poor conditions
        score -= conditions.cloudCover;
        score -= (100 - conditions.visibility / 10000) * 0.5;
        score -= conditions.humidity * 0.2;
        score -= conditions.windSpeed * 2;

        return {
            score: Math.max(0, Math.min(100, score)),
            conditions: {
                ...conditions,
                rating: this.getViewingRating(score)
            }
        };
    }

    // Get viewing rating based on score
    getViewingRating(score) {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        if (score >= 20) return 'Poor';
        return 'Not Recommended';
    }

    // Format astronomical data for display
    formatAstronomicalData(data) {
        return {
            ...data,
            formattedTime: new Date(data.time).toLocaleString(),
            formattedAltitude: `${data.altitude.toFixed(1)}°`,
            formattedAzimuth: `${data.azimuth.toFixed(1)}°`
        };
    }
}

// Initialize astronomy manager
const astronomyManager = new AstronomyManager();

// Export for use in other modules
window.astronomyManager = astronomyManager; 