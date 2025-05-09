import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: true,
    port: 5173,
    proxy: {
      // tudo que bater em /api vai para o back-end
      "/api": {
        target: "http://host.docker.internal:8000", 
        // em Windows/Mac: host.docker.internal
        // em Linux, se não funcionar, use o IP da sua máquina
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, "")
      }
    }
  },
  css: {
    postcss: { plugins: [tailwind()] }
  }
});
