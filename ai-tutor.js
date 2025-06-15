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
            if (!response.ok) throw new Error('Perplexity API error');
            const data = await response.json();
            // Perplexity returns choices[0].message.content
            return data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
                ? data.choices[0].message.content.trim()
                : 'Sorry, I could not get a response from the AI.';
        } catch (error) {
            console.error('Error getting AI response:', error);
            return 'I apologize, but I encountered an error. Please try again later.';
        }
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