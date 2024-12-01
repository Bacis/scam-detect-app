import '@src/Popup.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { youtubeShortsStorageExport, browsingStorageExport } from '@extension/storage';
import { type ComponentPropsWithoutRef } from 'react';
import type { YoutubeShortsStorage } from '@extension/storage';

const Popup = () => {
  const youtubeShorts = useStorage(youtubeShortsStorageExport);
  const browsing = useStorage(browsingStorageExport);
  const isYoutubeShortsEnabled = youtubeShorts === 'enabled';
  const isBrowsingEnabled = browsing === 'enabled';

  return (
    <div className={`App bg-gray-800`}>
      <header className="App-header text-gray-900">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row items-center">
            <span className="text-5xl">🥷</span>
            <span className="bg-gray-700 text-xl font-bold text-white p-2 rounded-lg">Anti-Scam AI Ninja</span>
          </div>
          <div className="flex flex-col mt-4">
            <ToggleButton storage={youtubeShortsStorageExport}>
              {isYoutubeShortsEnabled ? 'Disable' : 'Enable'} YouTube Shorts
            </ToggleButton>
            <ToggleButton storage={browsingStorageExport} className="mt-2">
              {isBrowsingEnabled ? 'Disable' : 'Enable'} Browsing
            </ToggleButton>
          </div>
          <div className="flex flex-col mt-6 bg-gray-700 p-4 rounded-lg text-white">
            <h2 className="text-lg font-bold">Learn</h2>
            <p className="mt-2">
              Scammers are increasingly using AI to impersonate well-known public figures like Elon Musk or Michael Saylor on YouTube Shorts. 
              These impersonations are designed to lure unsuspecting viewers into fraudulent schemes, promising lucrative rewards in exchange for money. 
              Stay vigilant and always verify the authenticity of such content.
            </p>
          </div>
        </div>
      </header>
    </div>
  );
};

const ToggleButton = ({ storage, ...props }: { storage: YoutubeShortsStorage } & ComponentPropsWithoutRef<'button'>) => {
  const status = useStorage(storage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (status === 'enabled' ? 'bg-green-600 text-white shadow-black' : 'bg-red-600 text-white')
      }
      onClick={storage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
