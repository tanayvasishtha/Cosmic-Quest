const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const iconPath = path.join(__dirname, 'assets', 'icons');

// Ensure the icons directory exists
if (!fs.existsSync(iconPath)) {
    fs.mkdirSync(iconPath, { recursive: true });
}

// Create a simple cosmic-themed icon
async function generateIcons() {
    const baseIcon = sharp({
        create: {
            width: 512,
            height: 512,
            channels: 4,
            background: { r: 107, g: 70, b: 193, alpha: 1 }
        }
    })
        .composite([
            {
                input: {
                    text: {
                        text: 'CC',
                        font: 'Space Grotesk',
                        fontSize: 256,
                        rgba: true
                    }
                },
                gravity: 'center'
            }
        ]);

    // Generate all size variants
    for (const size of sizes) {
        await baseIcon
            .resize(size, size)
            .toFile(path.join(iconPath, `icon-${size}x${size}.png`));
        console.log(`Generated ${size}x${size} icon`);
    }

    // Generate favicon
    await baseIcon
        .resize(32, 32)
        .toFile(path.join(__dirname, 'favicon.png'));
    console.log('Generated favicon.png');
}

generateIcons().catch(console.error); 