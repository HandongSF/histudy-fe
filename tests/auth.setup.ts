import { test as setup } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { loginAs } from './support/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authDir = path.join(__dirname, '/auth');

if (!fs.existsSync(authDir)) {
   fs.mkdirSync(authDir, { recursive: true });
}

const adminAuthFile = path.join(authDir, 'admin.json');

setup('ADMIN 인증 토큰 로컬 스토리지 저장', async ({ page }) => {
   await page.goto('/');

   const loginResult = await loginAs('ADMIN');

   await page.evaluate((tokens) => {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
   }, loginResult.tokens);

   await page.context().storageState({ path: adminAuthFile });
});

const memberFile = path.join(authDir, 'member.json');

setup('MEMBER 인증 토큰 로컬 스토리지 저장', async ({ page }) => {
   await page.goto('/');

   const loginResult = await loginAs('MEMBER');

   await page.evaluate((tokens) => {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
   }, loginResult.tokens);

   await page.context().storageState({ path: memberFile });
});
