// If you need config, uncomment the next line:
// import config from './config.js';

// Learning System
class LearningSystem {
    constructor() {
        this.levels = [
            {
                id: 1,
                title: 'Stargazing Basics',
                description: 'Learn the fundamentals of stargazing',
                lessons: [
                    {
                        id: 'basic-1',
                        title: 'Finding the North Star',
                        content: 'Learn how to locate Polaris, the North Star, and use it for navigation.',
                        completed: false
                    },
                    {
                        id: 'basic-2',
                        title: 'Understanding Star Magnitude',
                        content: 'Discover how astronomers measure star brightness.',
                        completed: false
                    },
                    {
                        id: 'basic-3',
                        title: 'Using Star Charts',
                        content: 'Master the art of reading and using star charts.',
                        completed: false
                    }
                ]
            },
            {
                id: 2,
                title: 'Planetary Observation',
                description: 'Identify and observe planets in the night sky',
                lessons: [
                    {
                        id: 'planet-1',
                        title: 'Spotting Venus',
                        content: 'Learn to identify Venus, the brightest planet in our sky.',
                        completed: false
                    },
                    {
                        id: 'planet-2',
                        title: 'Finding Jupiter',
                        content: 'Discover how to locate Jupiter and its moons.',
                        completed: false
                    },
                    {
                        id: 'planet-3',
                        title: 'Observing Mars',
                        content: 'Learn to identify the Red Planet and its features.',
                        completed: false
                    }
                ]
            },
            {
                id: 3,
                title: 'Constellation Mastery',
                description: 'Master the art of constellation identification',
                lessons: [
                    {
                        id: 'const-1',
                        title: 'The Big Dipper',
                        content: 'Learn to find and use the Big Dipper as a guide.',
                        completed: false
                    },
                    {
                        id: 'const-2',
                        title: 'Orion\'s Belt',
                        content: 'Discover the famous constellation of Orion.',
                        completed: false
                    },
                    {
                        id: 'const-3',
                        title: 'Zodiac Constellations',
                        content: 'Learn about the constellations of the zodiac.',
                        completed: false
                    }
                ]
            }
        ];

        this.achievements = [
            {
                id: 'first-star',
                title: 'First Star',
                description: 'Successfully identified your first star',
                icon: '⭐',
                unlocked: false
            },
            {
                id: 'planet-hunter',
                title: 'Planet Hunter',
                description: 'Spotted all visible planets',
                icon: '🌍',
                unlocked: false
            },
            {
                id: 'constellation-master',
                title: 'Constellation Master',
                description: 'Identified 10 different constellations',
                icon: '✨',
                unlocked: false
            }
        ];

        this.currentLevel = 1;
        this.progress = 0;
        this.initializeLearning();
    }

    async initializeLearning() {
        this.loadProgress();
        this.renderLearningPath();
        this.updateAchievements();
    }

    // Load user progress from local storage
    loadProgress() {
        const savedProgress = localStorage.getItem('learningProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.currentLevel = progress.currentLevel;
            this.progress = progress.progress;
            this.levels = progress.levels;
            this.achievements = progress.achievements;
        }
    }

    // Save progress to local storage
    saveProgress() {
        const progress = {
            currentLevel: this.currentLevel,
            progress: this.progress,
            levels: this.levels,
            achievements: this.achievements
        };
        localStorage.setItem('learningProgress', JSON.stringify(progress));
    }

    // Render the learning path
    renderLearningPath() {
        const learningPath = document.querySelector('.learning-path');
        if (!learningPath) return;

        // Add progress bar
        const progressHTML = `
            <div class="cosmic-card progress-card">
                <h3>Your Learning Progress</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.progress}%"></div>
                </div>
                <p>${Math.round(this.progress)}% Complete - Keep going! 🌟</p>
            </div>
        `;

        const levelsHTML = this.levels.map(level => `
            <div class="cosmic-card level-card ${level.id === this.currentLevel ? 'active' : ''}">
                <h3>${level.title}</h3>
                <p>${level.description}</p>
                <div class="lessons-list">
                    ${level.lessons.map(lesson => `
                        <div class="lesson-item ${lesson.completed ? 'completed' : ''}">
                            <h4>${lesson.title}</h4>
                            <p>${lesson.content}</p>
                            ${!lesson.completed ? `
                                <button class="cta-button secondary" 
                                        onclick="learningSystem.completeLesson('${lesson.id}')">
                                    Complete Lesson
                                </button>
                            ` : `
                                <span class="completed-badge">✓ Completed</span>
                            `}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        learningPath.innerHTML = progressHTML + levelsHTML;
    }

    // Complete a lesson
    completeLesson(lessonId) {
        const level = this.levels.find(l => l.lessons.some(lesson => lesson.id === lessonId));
        if (!level) return;

        const lesson = level.lessons.find(l => l.id === lessonId);
        if (!lesson || lesson.completed) return;

        lesson.completed = true;
        this.updateProgress();
        this.checkAchievements();
        this.saveProgress();
        this.renderLearningPath();
        this.showNotification(`Completed: ${lesson.title}!`);
    }

    // Update overall progress
    updateProgress() {
        const totalLessons = this.levels.reduce((sum, level) => sum + level.lessons.length, 0);
        const completedLessons = this.levels.reduce(
            (sum, level) => sum + level.lessons.filter(lesson => lesson.completed).length,
            0
        );
        this.progress = (completedLessons / totalLessons) * 100;

        // Update current level
        const currentLevelProgress = this.levels[this.currentLevel - 1].lessons.filter(
            lesson => lesson.completed
        ).length;
        if (currentLevelProgress === this.levels[this.currentLevel - 1].lessons.length) {
            this.currentLevel = Math.min(this.currentLevel + 1, this.levels.length);
        }
    }

    // Check and update achievements
    checkAchievements() {
        // First Star achievement
        if (!this.achievements[0].unlocked && this.levels[0].lessons[0].completed) {
            this.unlockAchievement('first-star');
        }

        // Planet Hunter achievement
        if (!this.achievements[1].unlocked &&
            this.levels[1].lessons.every(lesson => lesson.completed)) {
            this.unlockAchievement('planet-hunter');
        }

        // Constellation Master achievement
        if (!this.achievements[2].unlocked &&
            this.levels[2].lessons.every(lesson => lesson.completed)) {
            this.unlockAchievement('constellation-master');
        }
    }

    // Unlock an achievement
    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.showNotification(
                `Achievement Unlocked: ${achievement.title}! ${achievement.icon}`,
                'achievement'
            );
            this.updateAchievements();
        }
    }

    // Update achievements display
    updateAchievements() {
        const achievementsContainer = document.querySelector('.achievements-container');
        if (!achievementsContainer) return;

        const achievementsHTML = this.achievements.map(achievement => `
            <div class="cosmic-card achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
                ${achievement.unlocked ?
                '<span class="unlocked-badge">Unlocked!</span>' :
                '<span class="locked-badge">Locked</span>'
            }
            </div>
        `).join('');

        achievementsContainer.innerHTML = achievementsHTML;
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

// Initialize learning system and make it globally accessible
const learningSystem = new LearningSystem();
window.learningSystem = learningSystem;

// Sanitize HTML to prevent XSS
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
} 