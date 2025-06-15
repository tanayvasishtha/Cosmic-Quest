import apiService from './api-service.js';
import aiTutor from './ai-tutor.js';
// If you need config, uncomment the next line:
// import config from './config.js';

// DOM Elements
const weatherInfo = document.getElementById('weather-info');
const objectsList = document.getElementById('objects-list');
const issInfo = document.getElementById('iss-info');
const starfield = document.getElementById('starfield');

// User's Location
let userLocation = {
    latitude: null,
    longitude: null
};

// AI Tutor Interaction
const chatMessages = document.getElementById('chat-messages');
const userQuestion = document.getElementById('user-question');
const askButton = document.getElementById('ask-button');

// Initialize the application
async function initApp() {
    setupStarfield();
    await getUserLocation();
    if (userLocation.latitude && userLocation.longitude) {
        await testAPIConnectivity(); // Test APIs first
        await Promise.all([
            updateWeatherInfo(),
            updateVisibleObjects(),
            updateISSInfo()
        ]);
    }
}

// Get user's location
async function getUserLocation() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        console.log('Location obtained:', userLocation);
    } catch (error) {
        console.error('Error getting location:', error);
        // Fallback to a default location (e.g., New York City)
        userLocation = {
            latitude: 40.7128,
            longitude: -74.0060
        };
    }
}

// Update weather information
async function updateWeatherInfo() {
    try {
        const weather = await apiService.getWeather(userLocation.latitude, userLocation.longitude);
        const skyConditions = await getSkyConditions();
        if (!weather || !weather.main || !weather.weather) throw new Error('Weather data unavailable');
        const weatherHTML = `
            <div class="weather-details">
                <p>Temperature: ${Math.round(weather.main.temp)}°C</p>
                <p>Conditions: ${weather.weather[0].description}</p>
                <p>Cloud Cover: ${weather.clouds.all}%</p>
                <p>Visibility: ${(weather.visibility / 1000).toFixed(1)}km</p>
                <p>Humidity: ${weather.main.humidity}%</p>
                <p>Wind Speed: ${weather.wind.speed}m/s</p>
                <p>Stargazing Conditions: ${skyConditions.quality}</p>
            </div>
        `;
        weatherInfo.innerHTML = weatherHTML;
    } catch (error) {
        weatherInfo.innerHTML = '<p>Weather information unavailable</p>';
    }
}

// Update visible astronomical objects
async function updateVisibleObjects() {
    try {
        const apod = await apiService.getAstronomyPictureOfDay();
        if (!apod || apod.error || !apod.url || !apod.title) throw new Error('APOD unavailable');
        const objectsHTML = `
            <div class="objects-list">
                <div class="apod-item">
                    <h4>Astronomy Picture of the Day</h4>
                    <img src="${apod.url}" alt="${apod.title}" style="max-width: 100%; border-radius: 8px;">
                    <p>${apod.title}</p>
                    <p>${apod.explanation}</p>
                </div>
            </div>
        `;
        objectsList.innerHTML = objectsHTML;
    } catch (error) {
        objectsList.innerHTML = '<p>Astronomical data unavailable</p>';
    }
}

// Update ISS pass times
async function updateISSInfo() {
    try {
        const issData = await apiService.getISSPassTimes(userLocation.latitude, userLocation.longitude);
        if (!issData || !issData.response || !Array.isArray(issData.response)) throw new Error('ISS data unavailable');
        const issHTML = `
            <div class="iss-passes">
                ${issData.response.slice(0, 3).map(pass => `
                    <div class="pass-item">
                        <p>Next Pass: ${new Date(pass.risetime * 1000).toLocaleString()}</p>
                        <p>Duration: ${Math.round(pass.duration / 60)} minutes</p>
                    </div>
                `).join('')}
            </div>
            ${issData.fallback ? '<div class="notification warning">Live ISS data unavailable, showing demo data.</div>' : ''}
        `;
        issInfo.innerHTML = issHTML;
    } catch (error) {
        issInfo.innerHTML = '<p>ISS information unavailable</p>';
    }
}

// Starfield Animation
function setupStarfield() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    starfield.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const stars = [];
    const numStars = 300;

    // Create stars with varying properties
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.5,
            speed: Math.random() * 0.5,
            brightness: Math.random(),
            twinkleSpeed: Math.random() * 0.02,
            twinkleDirection: Math.random() > 0.5 ? 1 : -1
        });
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            // Calculate star brightness with twinkling effect
            star.brightness += star.twinkleSpeed * star.twinkleDirection;
            if (star.brightness >= 1 || star.brightness <= 0.3) {
                star.twinkleDirection *= -1;
            }

            // Draw star with gradient
            const gradient = ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.size
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${star.brightness})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            // Move star
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);

// Handle navigation smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Handle mobile menu (to be implemented)
const mobileMenuButton = document.createElement('button');
mobileMenuButton.classList.add('mobile-menu-button');
mobileMenuButton.innerHTML = '☰';
document.querySelector('.nav-container').appendChild(mobileMenuButton);

mobileMenuButton.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
});

// Add initial AI greeting
function addAIMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai';
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add user message
function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user';
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle user question
async function handleQuestion() {
    const question = userQuestion.value.trim();
    if (!question) return;

    // Add user message
    addUserMessage(question);
    userQuestion.value = '';

    // Show loading state
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message ai loading';
    chatMessages.appendChild(loadingMessage);

    try {
        // Get AI response
        const userContext = {
            level: 'beginner', // This would come from user profile
            location: userLocation,
            skyConditions: await getSkyConditions(),
            learningHistory: [] // This would come from user progress
        };

        const response = await aiTutor.getPersonalizedResponse(question, userContext);

        // Remove loading message
        loadingMessage.remove();

        // Add AI response
        addAIMessage(response);
    } catch (error) {
        console.error('Error getting AI response:', error);
        loadingMessage.remove();
        addAIMessage('I apologize, but I encountered an error. Please try again later.');
    }
}

// Event listeners for AI tutor
askButton.addEventListener('click', handleQuestion);
userQuestion.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleQuestion();
    }
});

// Add initial greeting
document.addEventListener('DOMContentLoaded', () => {
    addAIMessage('Hello! I\'m your AI astronomy tutor. Ask me anything about the stars, planets, or space exploration!');
});

// Test API connectivity
async function testAPIConnectivity() {
    try {
        // Test OpenWeather API
        const weather = await apiService.getWeather(userLocation.latitude, userLocation.longitude);
        console.log('OpenWeather API Test:', weather.weather[0].description);

        // Test NASA API
        const apod = await apiService.getAstronomyPictureOfDay();
        console.log('NASA API Test:', apod.title);

        // Show success notification
        showNotification('API connection successful!', 'success');
    } catch (error) {
        console.error('API Test Error:', error);
        showNotification('API connection failed. Please check console for details.', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Get sky conditions for stargazing
async function getSkyConditions() {
    try {
        const weather = await apiService.getWeather(userLocation.latitude, userLocation.longitude);

        const conditions = {
            cloudCover: weather.clouds.all,
            visibility: weather.visibility / 1000, // Convert to km
            humidity: weather.main.humidity,
            windSpeed: weather.wind.speed
        };

        // Determine if conditions are good for stargazing
        const isClear = conditions.cloudCover < 30 &&
            conditions.visibility > 5 &&
            conditions.humidity < 80;

        return {
            ...conditions,
            isClear,
            quality: isClear ? 'Excellent' : conditions.cloudCover < 60 ? 'Fair' : 'Poor'
        };
    } catch (error) {
        console.error('Error getting sky conditions:', error);
        return {
            cloudCover: 0,
            visibility: 10,
            humidity: 50,
            windSpeed: 5,
            isClear: true,
            quality: 'Unknown'
        };
    }
}

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
} 