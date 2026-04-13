import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base =
    mode === "production" && process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/` : "/";

  const copy404Page = {
    name: "copy-404-for-github-pages",
    closeBundle() {
      const outDir = path.resolve(__dirname, "dist");
      const indexHtml = path.join(outDir, "index.html");
      const notFoundHtml = path.join(outDir, "404.html");

      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, notFoundHtml);
      }
    },
  };

  return {
    base,
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), mode === "development" && componentTagger(), copy404Page].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
