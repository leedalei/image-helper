import { defineConfig } from "vite";
import wails from "@wailsio/runtime/plugins/vite";
import react from "@vitejs/plugin-react";
import wyw from '@wyw-in-js/vite';
import path from "path";
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // React 19自动启用React Compiler
      // 无需额外配置
    }),
    wails("./bindings"),
    wyw({
      include: ['**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
      },
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@buildings": path.resolve(__dirname, "./buildings"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
