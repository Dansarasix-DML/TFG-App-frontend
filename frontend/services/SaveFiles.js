import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

export async function saveOAuthProfileImgToUser(username, profile_img_url) {
    try {
        // Define the path to the user's profile image
        const userDir = path.join(process.cwd(), 'public', 'users', username);
        const imgPath = path.join(userDir, 'profile_img.png');

        // Create the directory if it doesn't exist
        if (!existsSync(userDir)) {
            mkdirSync(userDir, { recursive: true });
        }

        // Fetch the image from the URL
        const response = await fetch(profile_img_url);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch image from ${profile_img_url}: ${response.statusText}`);
        }

        // Get the image buffer
        const buffer = await response.buffer();

        // Save the image to the file system
        writeFileSync(imgPath, buffer);

        console.log(`Image saved to ${imgPath}`);
    } catch (error) {
        console.error('Error saving profile image:', error);
    }
}