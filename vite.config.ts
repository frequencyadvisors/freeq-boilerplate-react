import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from "vite-plugin-svgr";
import { defineConfig as defineViteConfig, mergeConfig } from "vite";
import { defineConfig as defineVitestConfig } from "vitest/config";

const viteConfig = defineViteConfig({
  plugins: [svgr(), react(), tsconfigPaths()],
  server: {
    port: 3000,
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    watch: true,
    globals: true,
    environment: "jsdom",
    setupFiles: ["@testing-library/jest-dom", "./setupFiles.ts"],
    exclude: ["node_modules/**","tests/**","tests-examples/**"],
  },
});

export default mergeConfig(viteConfig, vitestConfig);
