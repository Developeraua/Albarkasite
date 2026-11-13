import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Standard Vite config for GitHub / Netlify / Vercel deployment:
// Generates a lightweight index.html with separate assets/ folder:
//   dist/index.html (small, references assets)
//   dist/assets/index-XXXX.js
//   dist/assets/index-XXXX.css
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist-gh-pages",
    assetsDir: "assets",
    chunkSizeWarningLimit: 1000,
  },
});
