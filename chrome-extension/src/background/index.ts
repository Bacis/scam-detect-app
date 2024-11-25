import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';
import { YoutubeTranscript } from 'youtube-transcript';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

interface TranscriptSegment {
  text: string;
  duration: number;
}

async function transcribeYoutubeShort(videoId: string): Promise<TranscriptSegment[]> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    console.log("URL changed to:", changeInfo.url);
    // Handle the URL change
    const url = new URL(changeInfo.url);
    if (url.hostname === 'www.youtube.com' && url.pathname.startsWith('/shorts/')) {
      const shortId = url.pathname.split('/')[2];
      transcribeYoutubeShort(shortId)
        .then(transcript => {
          const transcriptText = transcript.map(segment => segment.text).join(' ');
          console.log('Transcript:', transcriptText);
        })
        .catch(error => {
          console.error('Error transcribing YouTube short:', error);
        });
    }
  }
});
