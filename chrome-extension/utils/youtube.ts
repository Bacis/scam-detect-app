import { YoutubeTranscript } from 'youtube-transcript';

interface TranscriptSegment {
  text: string;
  duration: number;
}

export async function transcribeYoutubeShort(videoId: string): Promise<TranscriptSegment[]> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}
