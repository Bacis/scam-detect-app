/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TRIAL_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
