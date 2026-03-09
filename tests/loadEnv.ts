import dotenv from 'dotenv';

const loadDotenvFile = (path: string, override = false) => {
   const result = dotenv.config({ path });

   if (!result.parsed) {
      return;
   }

   for (const [key, value] of Object.entries(result.parsed)) {
      if (override || !process.env[key]) {
         process.env[key] = value;
      }
   }
};

loadDotenvFile('.env');

if (!process.env.CI) {
   loadDotenvFile('.env.test', true);
}
