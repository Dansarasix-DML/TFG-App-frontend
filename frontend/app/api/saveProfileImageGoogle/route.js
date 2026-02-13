import { NextResponse } from 'next/server';
import fetch from 'node-fetch'; // Importamos directamente desde node-fetch
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

export async function POST(request) {
    const { username, profile_img_url } = await request.json();

    if (!username || !profile_img_url) {
        return NextResponse.json({ error: 'Username and profile_img_url are required' }, { status: 400 });
    }

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

        return NextResponse.json({ message: `Image saved to ${imgPath}` });
    } catch (error) {
        console.error('Error saving profile image:', error);
        return NextResponse.json({ error: 'Error saving profile image', message: error.message }, { status: 500 });
    }
}
