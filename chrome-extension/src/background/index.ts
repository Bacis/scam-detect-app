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

const notificationOptions = (title: string, message: string) => ({
  type: 'basic',
  iconUrl: chrome.runtime.getURL('icon-34.png'),
  title,
  message,
} as const);

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
    const instruction = `Analyze the following YouTube short transcript: ${promptText}. Focus on identifying phrases or intents that explicitly ask for money, promote financial transactions, or encourage viewers to invest. Anything else, even talking about other type of crimes like murder, arson, etc., is not a scam. Provide the response in JSON format with a scam rating in a decimal value, where 1 is an absolute scam and closer to 0 is legitimate.`;
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

  try {
    return JSON.parse(jsonMatch[1]);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Invalid JSON format in markdown');
  }
}

chrome.aiOriginTrial.languageModel.capabilities().then(capabilities => {
  console.log('Language model capabilities:', capabilities);

  if (capabilities.available === 'readily') {
    chrome.aiOriginTrial.languageModel.create({
      systemPrompt: 'You are a helpful assistant that identifies financial cryptocurrency scams.',
      temperature: capabilities.defaultTemperature,
      topK: capabilities.defaultTopK,
    }).then(async sessionResponse => {
      console.log('Language model session created:', sessionResponse);
      session = sessionResponse;
    }).catch(error => {
      console.error('Error creating language model session:', error);
    });
  }
});

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
          promptLanguageModel(transcriptText)
            .then(response => {
              console.log('Language model response:', response);
              try {
                // Check if the sanitized response is not empty before parsing
                if (response) {
                    try {
                        chrome.tabs.create({ url: 'about:blank' }, (tab) => {
                          if (tab.id !== undefined) {
                            console.log('Warning tab opened with ID:', tab.id);
                            chrome.scripting.executeScript({
                              target: { tabId: tab.id },
                              func: () => {
                                document.addEventListener('DOMContentLoaded', () => {
                                  const div = document.createElement('div');
                                  div.style.display = 'flex';
                                  div.style.justifyContent = 'center';
                                  div.style.alignItems = 'center';
                                  div.style.height = '100vh';
                                  div.style.fontFamily = 'Arial, sans-serif';
                                  div.style.backgroundColor = 'white';
                                  
                                  const h1 = document.createElement('h1');
                                  h1.style.color = 'red';
                                  h1.textContent = 'Warning: Potential Scam Detected!';
                                  
                                  div.appendChild(h1);
                                  document.body.appendChild(div);
                                  document.body.style.margin = '0';
                                  document.body.style.height = '100vh';
                                });
                              },
                            });
                          }
                        });
                        // const parsedResponse = parseMarkdownJSON(response);
                        // const scamRating = parsedResponse.scam_rating;
                        // const phrasesIntents = parsedResponse.phrases_intents;
                        // const explanation = parsedResponse.explanation;

                        // console.log('Scam Rating:', scamRating);
                        // console.log('Phrases/Intents:', phrasesIntents);
                        // console.log('Explanation:', explanation);

                        // chrome.notifications.create('scam-alert-' + Date.now(), {
                        //   type: 'basic',
                        //   iconUrl: "/icon-34.png",
                        //   title: 'Scam Alert',
                        //   message: `Scam Rating: 'No scam rating provided'}\nExplanation: 'No explanation provided'}`,
                        // }, (notificationId) => {
                        //   if (chrome.runtime.lastError) {
                        //     console.error('Error creating notification:', chrome.runtime.lastError);
                        //   } else {
                        //     console.log('Notification created with ID:', notificationId);
                        //   }
                        // });
                    } catch (error) {
                        console.error('Error parsing language model response:', error);
                    }
                } else {
                    console.error('Sanitized response is empty, cannot parse JSON.');
                }
              } catch (error) {
                console.error('Error parsing language model response:', error);
              }
              chrome.notifications.create('scam-alert', notificationOptions('Scam Alert', response));
            })
            .catch(error => {
              console.error('Error prompting language model:', error);
            });
        })
        .catch(error => {
          console.error('Error transcribing YouTube short:', error);
        });
    }
  }
});
