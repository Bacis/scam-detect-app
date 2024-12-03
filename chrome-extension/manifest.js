import fs from 'node:fs';
import deepmerge from 'deepmerge';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = deepmerge(
  {
    manifest_version: 3,
    default_locale: 'en',
    /**
     * if you want to support multiple languages, you can use the following reference
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
     */
    name: '__MSG_extensionName__',
    version: packageJson.version,
    description: '__MSG_extensionDescription__',
    host_permissions: ['<all_urls>', 'chrome-extension://*'],
    permissions: ['storage', 'scripting', 'tabs', 'aiLanguageModelOriginTrial'],
    trial_tokens: [process.env.TRIAL_TOKEN || ''],
    background: {
      service_worker: 'background.iife.js',
      type: 'module',
    },
    action: {
      default_popup: 'popup/index.html',
      default_icon: 'ninja-icon.png',
    },
    icons: {
      128: 'ninja-icon.png',
    },
    web_accessible_resources: [
      {
        resources: ['*.js', '*.css', '*.svg', 'ninja-icon.png'],
        matches: ['*://*/*'],
      },
    ],
  },
  !isFirefox,
);

export default manifest;
