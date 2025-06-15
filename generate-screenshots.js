const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const screenshotPath = path.join(__dirname, 'assets', 'screenshots');
const screenshots = ['home', 'events', 'learn'];

// Ensure the screenshots directory exists
if (!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath, { recursive: true });
}

async function generateScreenshots() {
    for (const name of screenshots) {
        await sharp({
            create: {
                width: 1280,
                height: 720,
                channels: 4,
                background: { r: 11, g: 20, b: 38, alpha: 1 }
            }
        })
            .composite([
                {
                    input: {
                        text: {
                            text: `Cosmic Quest - ${name.charAt(0).toUpperCase() + name.slice(1)} Screen`,
                            font: 'Space Grotesk',
                            fontSize: 48,
                            rgba: true
                        }
                    },
                    gravity: 'center'
                }
            ])
            .toFile(path.join(screenshotPath, `${name}.png`));
        console.log(`Generated ${name} screenshot`);
    }
}

generateScreenshots().catch(console.error); 