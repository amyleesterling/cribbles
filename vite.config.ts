import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "client",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
      "@shared": path.resolve(__dirname, "./shared")
    }
  },
  build: {
    outDir: path.resolve(__dirname, "server/public"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true
  }
});
