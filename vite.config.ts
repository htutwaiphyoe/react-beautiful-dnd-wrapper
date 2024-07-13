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
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.tsx?$/,
    jsx: "automatic",
  },
  plugins: [react(), dts()],
});
