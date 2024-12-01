import '@src/NewTab.css';
import '@src/NewTab.scss';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import { useEffect, useState } from 'react';

const ScamAlert = ({
  scamRating,
  explanation,
  incomingUrl,
}: {
  scamRating: number;
  explanation: string;
  incomingUrl: string;
}) => {
  return (
    <div className="flex items-center justify-center h-screen bg-red-500 text-white">
      <div className="bg-red-600 p-8 rounded-lg shadow-lg w-1/2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Scam Alert!</h2>
          <div className="flex items-center">
            <span className="font-bold mr-2">Score:</span>
            <div className="bg-white text-red-600 font-bold px-4 py-2 rounded-full">{scamRating}</div>
          </div>
        </div>
        <p className="text-white text-base mb-4 text-left">
          The message you just saw was from a YouTube Shorts video and has been identified by the Anti-Scam AI Ninja as
          a potential scam.
        </p>
        <p className="text-white text-base text-left">{explanation}</p>
        <div className="mt-4 text-white text-base text-left">
          The link you were shown is:&nbsp;
          <button
            onClick={() => alert('This is a placeholder for a suspicious link.')}
            className="underline text-white hover:text-blue-700">
            {incomingUrl}
          </button>
        </div>
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
    explanation:
      'The message contains phrases that are commonly associated with scams, such as "suspicious link" and "urgent action required". These phrases are often used to create a sense of urgency and trick the recipient into clicking on a malicious link.',
  });

  const [incomingUrl, setIncomingUrl] = useState<string>('https://example.com/suspicious-link');

  useEffect(() => {
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.content) {
        console.log('Received dynamic content:', request.content);

        // Update the state with the incoming message
        setIncomingMessage(request.content.message);
        setIncomingUrl(request.content.url);
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
            incomingUrl={incomingUrl}
          />
        )}
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>{t('loading')}</div>), <div> Error Occur </div>);
