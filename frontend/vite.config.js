import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://mern-e-commerce-ulnh.onrender.com",
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Adjust the value as needed (size in KB)
  },
});
