import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import './loadEnv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authDir = path.join(__dirname, '/auth');

if (!fs.existsSync(authDir)) {
   fs.mkdirSync(authDir, { recursive: true });
}

const adminAuthFile = path.join(authDir, 'admin.json');

const loginAs = async (sub: string) => {
   const { userLogin } = await import('@/apis/users');

   return userLogin(sub);
};

setup('ADMIN 인증 토큰 로컬 스토리지 저장', async ({ page }) => {
   await page.goto('/');

   const loginResult = await loginAs('test3');
   expect(loginResult.isRegistered).toBe(true);

   await page.evaluate((tokens) => {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
   }, loginResult.tokens);

   await page.context().storageState({ path: adminAuthFile });
});

const memberFile = path.join(authDir, 'member.json');

setup('MEMBER 인증 토큰 로컬 스토리지 저장', async ({ page }) => {
   // 먼저 페이지를 로드
   await page.goto('/');

   const loginResult = await loginAs('test2');
   expect(loginResult.isRegistered).toBe(true);

   await page.evaluate((tokens) => {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
   }, loginResult.tokens);

   await page.context().storageState({ path: memberFile });
});

// const userFile = path.join(authDir, "user.json");

// setup("USER 인증 토큰 로컬 스토리지 저장", async ({ page }) => {
//   await page.goto("/");

//   const loginResult = await userLogin("test1");

//   expect(loginResult.isRegistered).toBe(true);

//   await page.evaluate((tokens) => {
//     localStorage.setItem("accessToken", tokens.accessToken);
//     localStorage.setItem("refreshToken", tokens.refreshToken);
//   }, loginResult.tokens);

//   await page.context().storageState({ path: userFile });
// });
