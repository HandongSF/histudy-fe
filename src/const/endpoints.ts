const processEnv = typeof process !== 'undefined' ? process.env : undefined;
const viteEnv = import.meta.env;
const DEFAULT_BACKEND_BASE_URL = 'https://api.zionhann.com/histudy';

export const BACKEND_BASE_URL =
   processEnv?.VITE_BACK_BASE_URL || viteEnv?.VITE_BACK_BASE_URL || DEFAULT_BACKEND_BASE_URL;
