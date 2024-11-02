// @ts-nocheck
import dotenv from "dotenv";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

dotenv.config({ path: "../../.env" });

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../../dist/client",
  },
  define: {
    "process.env": {
      CLIENT_PORT: process.env.CLIENT_PORT,
      SERVER_PORT: process.env.SERVER_PORT,
      APP_URL: process.env.APP_URL,
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
