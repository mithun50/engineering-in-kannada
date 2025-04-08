import { VideoData } from '../types';

export async function getTotalVideos(courseId: string): Promise<number> {
  try {
    const videoData = (await import(`../data/videos/${courseId}.json`)) as VideoData;
    return videoData.videos.length;
  } catch (error) {
    console.error(`Error loading videos for course ${courseId}:`, error);
    return 0;
  }
} 