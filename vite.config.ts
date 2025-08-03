import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/logic-builder/", // Add your repository name here
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
