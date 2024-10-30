import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "client",
  base: '/notePad/',// Cambiado a la ruta relativa
  server: {
    port: 3000,
    open: true,
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, './private.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, './certificate.crt')),
    // },
  }
});
