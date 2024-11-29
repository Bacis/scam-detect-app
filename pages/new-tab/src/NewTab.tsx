import '@src/NewTab.css';
import '@src/NewTab.scss';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import { useEffect, useState } from 'react';

const NewTab = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  interface IncomingMessage {
    scam_rating: number;
    phrases_intents: string[];
    explanation: string;
  }

  const [incomingMessage, setIncomingMessage] = useState<IncomingMessage | null>(null);

  useEffect(() => {
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.content) {
        console.log('Received dynamic content:', request.content);
        
        // Update the state with the incoming message
        setIncomingMessage(request.content.message);
        
        // Optionally, send a response back to the background script
        sendResponse({ status: 'Message received' });
      }
    });
  }, []);

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <div className="flex items-center">
          <span className="text-8xl">🥷</span>
          <span className="text-white text-6xl ml-4">Scam Alert!</span>
        </div>
        {incomingMessage && (
          <div className="text-white flex">
            <div className="scam-rating-box bg-red-500 p-4 rounded-md shadow-md my-4 flex items-center w-1/4 h-40">
              <p className="text-2xl font-bold text-white">Scam Rating: </p>
              <span className="text-4xl ml-2">{incomingMessage?.scam_rating}</span>
            </div>
            <div className="flex-none w-3/4">
              <p>{incomingMessage?.explanation}</p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>{t('loading')}</div>), <div> Error Occur </div>);
