import config from './config.js';

class CosmicQuestAI {
    constructor() {
        this.learningPaths = {
            beginner: [
                'Introduction to Astronomy',
                'Understanding the Night Sky',
                'Basic Celestial Objects',
                'Stargazing Basics'
            ],
            intermediate: [
                'Deep Space Objects',
                'Advanced Stargazing Techniques',
                'Astrophotography Basics',
                'Understanding Star Charts'
            ],
            advanced: [
                'Advanced Astrophotography',
                'Cosmology and Universe',
                'Space Exploration',
                'Astronomy Research Methods'
            ]
        };

        this.commonQuestions = {
            'What is astronomy?': 'Astronomy is the scientific study of celestial objects, space, and the physical universe as a whole.',
            'How do I start stargazing?': 'Start by finding a dark location away from city lights, use a star map app, and begin by identifying major constellations.',
            'What equipment do I need?': 'For beginners, just your eyes and a star map are enough. As you progress, binoculars and telescopes become valuable tools.'
        };
    }

    async getPersonalizedResponse(question, userContext) {
        // Check for common questions first
        if (this.commonQuestions[question]) {
            return this.commonQuestions[question];
        }

        // Check if the question is about space/astronomy
        const spaceKeywords = [
            'space', 'astronomy', 'star', 'planet', 'galaxy', 'cosmos', 'moon', 'sun', 'telescope', 'universe', 'comet', 'asteroid', 'nebula', 'black hole', 'supernova', 'constellation', 'astronaut', 'rocket', 'satellite', 'iss', 'mars', 'venus', 'jupiter', 'saturn', 'mercury', 'uranus', 'neptune', 'pluto', 'milky way', 'exoplanet', 'meteor', 'eclipse', 'solstice', 'equinox', 'observatory', 'stargazing', 'cosmology', 'astro', 'lunar', 'solar', 'orbit', 'gravity', 'light year', 'parsec', 'astronomical', 'astrobiology', 'astrochemistry', 'astrogeology', 'astrophysics', 'celestial', 'extraterrestrial', 'interstellar', 'intergalactic', 'spacecraft', 'spaceship', 'spacex', 'nasa', 'esa', 'isro', 'jaxa', 'rover', 'probe', 'voyager', 'hubble', 'jwst', 'james webb', 'apollo', 'sputnik', 'cosmonaut', 'meteorite', 'shooting star', 'aurora', 'northern lights', 'southern lights', 'pulsar', 'quasar', 'dark matter', 'dark energy', 'big bang', 'expansion', 'redshift', 'blueshift', 'event horizon', 'singularity', 'gravity wave', 'gravitational wave', 'radio astronomy', 'infrared', 'ultraviolet', 'x-ray', 'gamma ray', 'cosmic microwave', 'background radiation', 'drake equation', 'fermi paradox', 'life on mars', 'alien', 'extraterrestrial life', 'astrobotany', 'astrocartography', 'astroinformatics', 'astrostatistics', 'astroengineering', 'astroethics', 'astrohistory', 'astrolinguistics', 'astromedicine', 'astronautics', 'astropolitics', 'astrosociology', 'astrotheology', 'astrovirology', 'astrozoology'
        ];
        const isSpaceRelated = spaceKeywords.some(keyword => question.toLowerCase().includes(keyword));
        if (!isSpaceRelated) {
            return 'Please ask something about space, astronomy, or the cosmos!';
        }

        // Build a context-aware prompt
        const prompt = this.buildPrompt(question, userContext);

        try {
            // Call Perplexity Sonar Pro API via Vercel serverless function
            const response = await fetch('/api/perplexity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    model: 'sonar-pro',
                    messages: [
                        { role: 'system', content: 'Be precise and concise.' },
                        { role: 'user', content: question }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('API Error Details:', errorData);

                if (response.status === 500 && errorData.error === 'API key not configured') {
                    return 'The AI service is currently being configured. Please try asking a general astronomy question, and I\'ll do my best to help with my built-in knowledge!';
                } else if (response.status === 500) {
                    return 'The AI service is temporarily unavailable. Here\'s what I can tell you from my astronomy knowledge: ' + this.getBasicResponse(question);
                } else {
                    throw new Error(`API Error: ${response.status}`);
                }
            }

            const data = await response.json();
            // Perplexity returns choices[0].message.content
            return data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
                ? data.choices[0].message.content.trim()
                : 'Sorry, I could not get a response from the AI.';
        } catch (error) {
            console.error('Error getting AI response:', error);

            // Provide fallback response for common astronomy topics
            const fallbackResponse = this.getBasicResponse(question);
            if (fallbackResponse) {
                return fallbackResponse + '\n\n(Note: AI service temporarily unavailable - this is from my basic knowledge base)';
            }

            return 'I apologize, but I\'m experiencing technical difficulties. Please try again later, or feel free to explore the learning resources on this page!';
        }
    }

    getBasicResponse(question) {
        const lowerQuestion = question.toLowerCase();

        // Extended knowledge base for common astronomy questions
        const responses = {
            'what is a star': 'A star is a massive, luminous sphere of plasma held together by gravity. Stars generate energy through nuclear fusion in their cores.',
            'what is a planet': 'A planet is a celestial body that orbits a star, has enough mass to be roughly spherical, and has cleared its orbital neighborhood.',
            'what is a galaxy': 'A galaxy is a massive collection of stars, gas, dust, and dark matter bound together by gravity. Our galaxy is called the Milky Way.',
            'what is the solar system': 'The Solar System consists of the Sun and all celestial objects that orbit it, including planets, moons, asteroids, and comets.',
            'what is a black hole': 'A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon.',
            'what is a nebula': 'A nebula is a cloud of gas and dust in space, often serving as stellar nurseries where new stars are born.',
            'what is the milky way': 'The Milky Way is our home galaxy, containing over 100 billion stars and measuring about 100,000 light-years across.',
            'what is a constellation': 'A constellation is a pattern of stars as seen from Earth, used for navigation and storytelling throughout history.',
            'what is a telescope': 'A telescope is an instrument that collects and focuses light to observe distant objects in space more clearly.',
            'how to start stargazing': 'Start by going to a dark location away from city lights, learn major constellations, and consider using a star chart or astronomy app.',
            'what equipment do i need': 'Begin with just your eyes and a star chart. Later, binoculars (7x50 or 10x50) and eventually a telescope can enhance your experience.',
            'when is the best time to stargaze': 'The best time is during new moon phases when skies are darkest, away from city lights, on clear nights.',
            'what is a supernova': 'A supernova is the explosive death of a massive star, briefly outshining entire galaxies and creating heavy elements.',
            'what is dark matter': 'Dark matter is invisible matter that makes up about 27% of the universe, detected only through its gravitational effects.',
            'what is the big bang': 'The Big Bang is the prevailing scientific theory explaining how the universe expanded from an initial state of extremely high density and temperature.',
            'what is a comet': 'A comet is a small icy body that develops a tail when it approaches the Sun, often called a "dirty snowball."',
            'what is an asteroid': 'An asteroid is a rocky object that orbits the Sun, mostly found in the asteroid belt between Mars and Jupiter.',
            'what is the international space station': 'The ISS is a large spacecraft in orbit around Earth where astronauts live and conduct scientific research.',
            'how far is the moon': 'The Moon is approximately 384,400 kilometers (238,855 miles) away from Earth.',
            'how big is the sun': 'The Sun has a diameter of about 1.39 million kilometers (864,000 miles), making it 109 times wider than Earth.'
        };

        // Check for exact or partial matches
        for (const [key, response] of Object.entries(responses)) {
            if (lowerQuestion.includes(key) || key.includes(lowerQuestion)) {
                return response;
            }
        }

        // Check for topic-based responses
        if (lowerQuestion.includes('mars')) {
            return 'Mars is the fourth planet from the Sun, known as the "Red Planet" due to iron oxide on its surface. It has two small moons: Phobos and Deimos.';
        }
        if (lowerQuestion.includes('jupiter')) {
            return 'Jupiter is the largest planet in our Solar System, a gas giant with over 80 moons including the four large Galilean moons: Io, Europa, Ganymede, and Callisto.';
        }
        if (lowerQuestion.includes('saturn')) {
            return 'Saturn is famous for its prominent ring system made of ice and rock particles. It\'s a gas giant with over 80 moons, including Titan.';
        }
        if (lowerQuestion.includes('venus')) {
            return 'Venus is the hottest planet in our Solar System due to its thick atmosphere creating a runaway greenhouse effect. It rotates backwards compared to most planets.';
        }
        if (lowerQuestion.includes('mercury')) {
            return 'Mercury is the smallest planet and closest to the Sun, with extreme temperature variations from -173°C to 427°C.';
        }

        return null; // No basic response available
    }

    buildPrompt(question, userContext) {
        const { level, location, skyConditions } = userContext;

        return `
            User Level: ${level}
            Location: ${location ? `${location.latitude}, ${location.longitude}` : 'Unknown'}
            Sky Conditions: ${skyConditions ? skyConditions.description : 'Unknown'}
            
            Question: ${question}
            
            Please provide a response that:
            1. Is appropriate for a ${level} level astronomer
            2. Takes into account the user's location and sky conditions
            3. Includes practical tips for observation when relevant
            4. Suggests related topics to explore
        `;
    }

    suggestActivities(userContext) {
        const { level, skyConditions } = userContext;
        const activities = [];

        // Add level-appropriate activities
        activities.push(...this.learningPaths[level].slice(0, 2));

        // Add sky condition-specific activities
        if (skyConditions) {
            if (skyConditions.isClear) {
                activities.push('Night Sky Observation');
                activities.push('Constellation Identification');
            } else {
                activities.push('Indoor Astronomy Learning');
                activities.push('Planetarium Visit Planning');
            }
        }

        return activities;
    }

    updateLearningProgress(userId, topic, progress) {
        // In a real implementation, this would update a database
        console.log(`Updated progress for user ${userId} in ${topic}: ${progress}%`);
    }
}

// Initialize the AI tutor
const aiTutor = new CosmicQuestAI();

// Export for use in other modules
export default aiTutor; 