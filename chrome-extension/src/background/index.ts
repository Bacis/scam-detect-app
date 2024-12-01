import 'webextension-polyfill';
import { youtubeShortsStorageExport } from '@extension/storage';
import { YoutubeTranscript } from 'youtube-transcript';
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

let session: chrome.aiOriginTrial.LanguageModelSession | null = null;

async function promptLanguageModel(promptText: string): Promise<string> {
  if (!session) {
    throw new Error('Language model session is not initialized.');
  }

  try {
    const instruction = `
      Analyze the following YouTube short transcript: ${promptText}. 
      Focus on identifying phrases or intents that explicitly ask for money, 
      promote financial transactions, or encourage viewers to invest. 
      Anything else, even talking about other types of crimes like murder, arson, etc., is not a scam. Bevare of satire
      and sarcasm as youtube is full of funny content. Scams usually are not funny.
      Scams always communicate directly to the viewer, you have to be careful with indirect communication.
      Provide the response in JSON format with a scam rating in a decimal value, 
      where 1 is an absolute scam and closer to 0 is legitimate. 
      Also, I want you to structure the response in a way that is easy to parse and extract the keys: 
      scam_rating, phrases_intents, and explanation.
    `;
    const response = await session.prompt(instruction);
    console.log(`tokens: ${session.tokensSoFar}/${session.maxTokens}`);
    return response;
  } catch (error) {
    console.error('Error prompting language model:', error);
    throw error;
  }
}

function parseMarkdownJSON(markdownText: string) {
  // Extract JSON from markdown code block
  const jsonMatch = markdownText.match(/```json\n([\s\S]*?)\n```/);

  if (!jsonMatch) {
    throw new Error('No JSON code block found in markdown');
  }

  let jsonString = jsonMatch[1];

  // Remove any non-JSON text before and after the JSON block
  const jsonStart = jsonString.indexOf('{');
  const jsonEnd = jsonString.lastIndexOf('}') + 1;

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Invalid JSON format in markdown');
  }

  jsonString = jsonString.substring(jsonStart, jsonEnd);

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Invalid JSON format in markdown');
  }
}

chrome.aiOriginTrial.languageModel.capabilities().then(capabilities => {
  console.log('Language model capabilities:', capabilities);

  if (capabilities.available === 'readily') {
    chrome.aiOriginTrial.languageModel
      .create({
        systemPrompt: 'You are a helpful assistant that identifies financial cryptocurrency scams.',
        temperature: capabilities.defaultTemperature,
        topK: capabilities.defaultTopK,
      })
      .then(async sessionResponse => {
        console.log('Language model session created:', sessionResponse);
        session = sessionResponse;
      })
      .catch(error => {
        console.error('Error creating language model session:', error);
      });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    console.log('URL changed to:', changeInfo.url);
    // Handle the URL change
    const url = new URL(changeInfo.url);
    if (url.hostname === 'www.youtube.com' && url.pathname.startsWith('/shorts/')) {
      const shortId = url.pathname.split('/')[2];

      // Use a reactive approach to listen for changes in the storage
      youtubeShortsStorageExport
        .get()
        .then(async status => {
          console.log('youtubeShortsStorageExport', status);
          if (status === 'enabled') {
            try {
              const transcript = await transcribeYoutubeShort(shortId);
              const transcriptText = transcript.map(segment => segment.text).join(' ');
              const response = await promptLanguageModel(transcriptText);
              const parsedResponse = parseMarkdownJSON(response);
              const scamRating = parsedResponse.scam_rating;
              console.log('Scam rating:', scamRating);

              if (scamRating >= 0 && response) {
                try {
                  chrome.tabs.create({ url: 'new-tab/index.html' }, tab => {
                    if (tab.id !== undefined) {
                      const dynamicContent = {
                        message: parsedResponse,
                        url: changeInfo.url,
                      };

                      setTimeout(() => {
                        if (tab.id !== undefined) {
                          chrome.tabs.sendMessage(tab.id, { content: dynamicContent }).catch(console.error);
                        }
                      }, 100);
                    }
                  });
                } catch (error) {
                  console.error(error);
                }
              }
            } catch (error) {
              console.error(error);
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
});
