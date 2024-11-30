import '@src/NewTab.css';
import '@src/NewTab.scss';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import { useEffect, useState } from 'react';

const ScamAlert = ({ scamRating, explanation }: { scamRating: number, explanation: string }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-1/2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Scam Alert!</h2>
          <div className="bg-red-500 text-white font-bold px-4 py-2 rounded-full">
            {scamRating}
          </div>
        </div>
        <p className="text-gray-400">
          {explanation}
        </p>
      </div>
    </div>
  );
};

const NewTab = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'dark';
  interface IncomingMessage {
    scam_rating: number;
    phrases_intents: string[];
    explanation: string;
  }

  const [incomingMessage, setIncomingMessage] = useState<IncomingMessage | null>({
    scam_rating: 85,
    phrases_intents: ['suspicious link', 'urgent action required'],
    explanation: 'The message contains phrases that are commonly associated with scams, such as "suspicious link" and "urgent action required". These phrases are often used to create a sense of urgency and trick the recipient into clicking on a malicious link.'
  });

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
        {incomingMessage && (
          <ScamAlert 
            scamRating={incomingMessage.scam_rating} 
            explanation={incomingMessage.explanation} 
          />
        )}
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>{t('loading')}</div>), <div> Error Occur </div>);
