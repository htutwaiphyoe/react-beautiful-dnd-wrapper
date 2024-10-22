import path from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    lib: {
      name: "react-beautiful-dnd-wrapper",
      fileName: (format) => `index.${format}.js`,
      entry: path.resolve(__dirname, "src/index.ts"),
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-beautiful-dnd"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-beautiful-dnd": "ReactBeautifulDnd",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [react(), dts()],
});
