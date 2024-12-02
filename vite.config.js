import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), nodePolyfills()],
  //--> THIS WILL BE USED IN RUNNING ELECTRON APP
  base: "./",
  server: {
    port: 5371,
  },
  //<---
  resolve: {
    alias: {
      "source-map-js": "source-map",
    },
  },
});
