/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_API_ORIGIN: string;
    readonly VITE_API_KEY: string;
    readonly VITE_DOMAIN: string;
    readonly VITE_CLIENT_ID: string;
    readonly VITE_AUDIENCE: string;
    // more env variables...
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}
