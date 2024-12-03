import 'webextension-polyfill';
import { youtubeShortsStorageExport } from '@extension/storage';
import { transcribeYoutubeShort } from '../../utils/youtube';
import { parseMarkdownJSON } from '../../utils/helper';
import { createInstruction, initialPrompts } from '../../utils/prompts';

let session: chrome.aiOriginTrial.LanguageModelSession | null = null;

async function promptLanguageModel(promptText: string): Promise<string> {
  if (!session) {
    throw new Error('Language model session is not initialized.');
  }

  try {
    const instruction = createInstruction(promptText);
    const response = await session.prompt(instruction);
    console.log(`tokens: ${session.tokensSoFar}/${session.maxTokens}`);
    return response;
  } catch (error) {
    console.error('Error prompting language model:', error);
    throw error;
  }
}

chrome.aiOriginTrial.languageModel.capabilities().then(capabilities => {
  console.log('Language model capabilities:', capabilities);

  if (capabilities.available === 'readily') {
    chrome.aiOriginTrial.languageModel
      .create({
        temperature: capabilities.defaultTemperature,
        topK: capabilities.defaultTopK,
        initialPrompts: initialPrompts,
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
              console.log('transcript text:', transcriptText);

              const response = await promptLanguageModel(transcriptText);
              const parsedResponse = parseMarkdownJSON(response);
              const scamRating = parsedResponse.scam_rating;
              console.log('Scam rating:', scamRating);

              if (scamRating > 0.9 && response) {
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
