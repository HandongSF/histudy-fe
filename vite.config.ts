import * as path from "path";
import tailwindcss from "@tailwindcss/vite";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), viteTsconfigPaths(), tailwindcss()],
    server: {
      port: 3000,
    },
    build: {
      assetsDir: env.VITE_PUBLIC_URL
        ? `${env.VITE_PUBLIC_URL.slice(1)}/assets`
        : "/assets",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
