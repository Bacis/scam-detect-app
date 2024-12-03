# Anti-Scam Ninja
![Header Image](header.png)


## Table of Contents

- [Intro](#intro)
- [Features](#features)
- [Structure](#structure)
    - [ChromeExtension](#structure-chrome-extension)
    - [Packages](#structure-packages)
    - [Pages](#structure-pages)
- [Getting started](#getting-started)
    - [Chrome](#getting-started-chrome)
- [Install dependency](#install-dependency)
    - [For root](#install-dependency-for-root)
    - [For module](#install-dependency-for-module)

## Scam Validation <a name="scam-validation"></a>

The `chrome-extension/src/background/index.ts` file contains the main logic for the browser extension. Below is a brief explanation of the key parts of the code:

1. **Initial Prompts Setup**: The initial prompts are defined to provide context for the language model. These prompts include various transcripts and their corresponding analysis by the assistant, which helps the model understand different scenarios and identify potential scams.

2. **Language Model Initialization**: The language model is initialized using the `chrome.aiOriginTrial.languageModel.create` method. The model is configured with default parameters such as temperature and topK, and the initial prompts are passed to it. This setup ensures that the model is ready to analyze new transcripts.

3. **URL Change Listener**: The extension listens for changes in the URL of the active tab using `chrome.tabs.onUpdated.addListener`. When a YouTube Shorts URL is detected, the extension retrieves the video ID and proceeds to transcribe the video.

4. **Transcript Analysis**: The transcript of the YouTube Short is obtained using the `transcribeYoutubeShort` function. The transcript text is then passed to the language model for analysis. The response from the model is parsed to extract the scam rating and other relevant information.

5. **Scam Detection and User Notification**: If the scam rating is higher than 0.9, the extension creates a new tab to display a warning to the user. The warning includes the parsed response from the language model and the URL of the YouTube Short. This helps users identify and avoid potential scams.

## Features <a name="features"></a>

- [React18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwindcss](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Turborepo](https://turbo.build/repo)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [Chrome Extension Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Custom I18n Package](/packages/i18n/)
- [Custom HMR(Hot Module Rebuild) Plugin](/packages/hmr/)
- [End to End Testing with WebdriverIO](https://webdriver.io/)

## Getting started: <a name="getting-started"></a>

1. When you're using Windows run this:
   - `git config --global core.eol lf`
   - `git config --global core.autocrlf input`
   #### This will change eol(End of line) to the same as on Linux/Mac, without this, you will have conflicts with your teammates with those systems and our bash script won't work
2. Clone this repository.
3. Change `extensionDescription` and `extensionName` in `messages.json` file in `packages/i18n/locales` folder.
4. Install pnpm globally: `npm install -g pnpm` (check your node version >= 18.19.1))
5. Run `pnpm install`

### Env Variables

1. Copy `chrome-extension/.example.env` and paste it as `.env` in the same path
2. Add `TRIAL_TOKEN` to the `.env` file. You can get it from [Google Origin Trial](https://developer.chrome.com/origintrials/#/view_trial/320318523496726529)

### And then, depending on needs:

### For Chrome: <a name="getting-started-chrome"></a>

1. Run:
    - Dev: `pnpm dev` (On windows, you should run as administrator. [(Issue#456)](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/456)
    - Prod: `pnpm build`
2. Open in browser - `chrome://extensions`
3. Check - `Developer mode`
4. Find and Click - `Load unpacked extension`
5. Select - `dist` folder at root

## Install dependency for turborepo: <a name="install-dependency"></a>

### For root: <a name="install-dependency-for-root"></a>

1. Run `pnpm i <package> -w`

### For module: <a name="install-dependency-for-module"></a>

1. Run `pnpm i <package> -F <module name>`

`package` - Name of the package you want to install e.g. `nodemon` \
`module-name` - You can find it inside each `package.json` under the key `name`, e.g. `@extension/content-script`, you can use only `content-script` without `@extension/` prefix

Made by [Andrius Bacianskas](https://bacianskas.com)
