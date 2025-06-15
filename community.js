// If you need config, uncomment the next line:
// import config from './config.js';

// Community Features
class CommunityManager {
    constructor() {
        this.events = [];
        this.groups = [];
        this.eventsContainer = document.getElementById('events-container');
        this.initializeCommunity();
    }

    async initializeCommunity() {
        await this.loadEvents();
        await this.loadGroups();
        this.renderEvents();
    }

    // Load events from local storage or API
    async loadEvents() {
        try {
            // In a real app, this would be an API call
            this.events = [
                {
                    id: 1,
                    title: 'Total Solar Eclipse Viewing Party',
                    date: '2025-03-29T10:00:00',
                    location: 'Dallas Arboretum, TX',
                    description: 'Experience the 2025 total solar eclipse with astronomers and live commentary. Solar glasses provided!',
                    organizer: 'American Astronomical Society',
                    attendees: 120,
                    equipment: 'Solar glasses and telescopes provided'
                },
                {
                    id: 2,
                    title: 'Perseid Meteor Shower Night',
                    date: '2025-08-12T22:00:00',
                    location: 'Joshua Tree National Park, CA',
                    description: 'Join us for a Perseid meteor shower watch under some of the darkest skies in the US.',
                    organizer: 'National Park Service',
                    attendees: 85,
                    equipment: 'Bring your own blanket or chair'
                },
                {
                    id: 3,
                    title: 'James Webb Space Telescope: Public Lecture',
                    date: '2025-05-15T18:30:00',
                    location: 'Hayden Planetarium, NYC',
                    description: 'A public talk on the latest discoveries from the James Webb Space Telescope, followed by Q&A.',
                    organizer: 'American Museum of Natural History',
                    attendees: 200,
                    equipment: 'Indoor event, no equipment needed'
                },
                {
                    id: 4,
                    title: 'International Observe the Moon Night',
                    date: '2025-10-04T19:00:00',
                    location: 'Griffith Observatory, LA',
                    description: 'Celebrate lunar science and exploration with telescope viewing and hands-on activities.',
                    organizer: 'NASA Night Sky Network',
                    attendees: 150,
                    equipment: 'Telescopes provided'
                }
            ];
        } catch (error) {
            console.error('Error loading events:', error);
            this.events = [];
        }
    }

    // Load groups from local storage or API
    async loadGroups() {
        try {
            // In a real app, this would be an API call
            this.groups = [
                {
                    id: 1,
                    name: 'NYC Astronomy Club',
                    members: 150,
                    description: 'New York City\'s premier astronomy community',
                    meetingFrequency: 'Weekly'
                },
                {
                    id: 2,
                    name: 'Stellar Education',
                    members: 80,
                    description: 'Focused on teaching astronomy to beginners',
                    meetingFrequency: 'Bi-weekly'
                },
                {
                    id: 3,
                    name: 'Space Enthusiasts Group',
                    members: 200,
                    description: 'For all things space and astronomy',
                    meetingFrequency: 'Monthly'
                }
            ];
        } catch (error) {
            console.error('Error loading groups:', error);
            this.groups = [];
        }
    }

    // Render events in the UI
    renderEvents() {
        if (!this.eventsContainer) return;

        const eventsHTML = this.events.map(event => `
            <div class="cosmic-card event-card">
                <h3>${event.title}</h3>
                <div class="event-details">
                    <p class="event-date">
                        <i class="far fa-calendar"></i>
                        ${new Date(event.date).toLocaleDateString()} at 
                        ${new Date(event.date).toLocaleTimeString()}
                    </p>
                    <p class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${event.location}
                    </p>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <span class="organizer">Organized by: ${event.organizer}</span>
                        <span class="attendees">${event.attendees} attending</span>
                    </div>
                    <p class="equipment">${event.equipment}</p>
                </div>
                <button class="cta-button secondary" onclick="communityManager.joinEvent(${event.id})">
                    Join Event
                </button>
            </div>
        `).join('');

        this.eventsContainer.innerHTML = eventsHTML;
    }

    // Join an event
    async joinEvent(eventId) {
        try {
            const event = this.events.find(e => e.id === eventId);
            if (!event) throw new Error('Event not found');

            // In a real app, this would be an API call
            event.attendees++;
            this.renderEvents();

            // Show success message
            this.showNotification(`Successfully joined ${event.title}!`);
        } catch (error) {
            console.error('Error joining event:', error);
            this.showNotification('Failed to join event. Please try again.', 'error');
        }
    }

    // Create a new event
    async createEvent(eventData) {
        try {
            // In a real app, this would be an API call
            const newEvent = {
                id: this.events.length + 1,
                ...eventData,
                attendees: 0
            };

            this.events.push(newEvent);
            this.renderEvents();
            this.showNotification('Event created successfully!');
        } catch (error) {
            console.error('Error creating event:', error);
            this.showNotification('Failed to create event. Please try again.', 'error');
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize community manager
const communityManager = new CommunityManager();

// Add event creation form handler
document.addEventListener('DOMContentLoaded', () => {
    const createEventForm = document.getElementById('create-event-form');
    if (createEventForm) {
        createEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const eventData = {
                title: formData.get('title'),
                date: formData.get('date'),
                location: formData.get('location'),
                description: formData.get('description'),
                organizer: formData.get('organizer'),
                equipment: formData.get('equipment')
            };
            await communityManager.createEvent(eventData);
            e.target.reset();
        });
    }
});

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
} 