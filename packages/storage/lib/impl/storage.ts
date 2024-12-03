import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

type Theme = 'light' | 'dark';
type YoutubeShorts = 'enabled' | 'disabled';
type Browsing = 'enabled' | 'disabled';
type LocalLLM = 'active' | 'inactive';

type ThemeStorage = BaseStorage<Theme> & {
  toggle: () => Promise<void>;
};

export type YoutubeShortsStorage = BaseStorage<YoutubeShorts> & {
  toggle: () => Promise<void>;
};

export type BrowsingStorage = BaseStorage<Browsing> & {
  toggle: () => Promise<void>;
};

export type LocalLLMStorage = BaseStorage<LocalLLM>;

const themeStorage = createStorage<Theme>('theme-storage-key', 'light', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

const youtubeShortsStorage = createStorage<YoutubeShorts>('youtube-shorts-storage-key', 'enabled', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

const browsingStorage = createStorage<Browsing>('browsing-storage-key', 'enabled', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

const localLLMStorage = createStorage<LocalLLM>('local-llm-storage-key', 'inactive', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// You can extend it with your own methods
export const exampleThemeStorage: ThemeStorage = {
  ...themeStorage,
  toggle: async () => {
    await themeStorage.set(currentTheme => {
      return currentTheme === 'light' ? 'dark' : 'light';
    });
  },
};

export const youtubeShortsStorageExport: YoutubeShortsStorage = {
  ...youtubeShortsStorage,
  toggle: async () => {
    await youtubeShortsStorage.set(currentStatus => {
      return currentStatus === 'enabled' ? 'disabled' : 'enabled';
    });
  },
};

export const browsingStorageExport: BrowsingStorage = {
  ...browsingStorage,
  toggle: async () => {
    await browsingStorage.set(currentStatus => {
      return currentStatus === 'enabled' ? 'disabled' : 'enabled';
    });
  },
};

export const localLLMStorageExport: LocalLLMStorage = {
  ...localLLMStorage,
};
