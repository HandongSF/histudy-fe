export const BACKEND_BASE_URL =
   process.env.NODE_ENV === 'test' ? process.env.VITE_BACK_BASE_URL : import.meta.env.VITE_BACK_BASE_URL;
