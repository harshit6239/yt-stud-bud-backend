import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// Create an authorized client
const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
});

// Function to search for videos and return a list of video IDs
async function searchVideos(query) {
    try {
        const response = await youtube.search.list({
            part: "snippet",
            q: query,
            type: "video",
            maxResults: 25, // Adjust the number of results as needed
        });

        console.log("Search response:", response.data);
        const videoIds = response.data.items.map((item) => item.id.videoId);
        return videoIds;
    } catch (error) {
        console.error("Error searching for videos:", error);
        return [];
    }
}

async function findVideoById(videoId) {
    const response = await youtube.videos.list({
        part: "snippet",
        id: videoId,
    });
    return response.data.items[0];
}

export { searchVideos, findVideoById };