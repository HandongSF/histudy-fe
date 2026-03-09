const processEnv = typeof process !== 'undefined' ? process.env : undefined;
const viteEnv = import.meta.env;

export const BACKEND_BASE_URL = processEnv?.VITE_BACK_BASE_URL || viteEnv?.VITE_BACK_BASE_URL || '';
