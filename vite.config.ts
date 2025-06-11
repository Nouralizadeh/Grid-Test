import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "#pretty/NumberBox": path.resolve(__dirname, "./NumberBox"),
      "#pretty/TextBox": path.resolve(__dirname, "./TextBox"),
    },
  },
});
