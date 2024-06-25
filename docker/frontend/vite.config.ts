import { defineConfig } from "vitest/config"
import { loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  if (mode == "production" || mode == "sit") {
    return {
      plugins: [svgr(), react(), tsconfigPaths()],
      server: {
        open: false,
		host: true,
		port: 5173
      },
      base: env.VITE_PUBLIC_PATH,
      resolve: {
        extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
      },
    }
  } else if (mode == "development") {
    return {
      plugins: [svgr(), react(), tsconfigPaths()],
      server: {
        open: false,
		host: true,
		port: 5173
      },
      base: env.VITE_PUBLIC_PATH,
      resolve: {
        extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
      },
      test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "src/setupTests",
        mockReset: true,
      },
    }
  } else {
    return {
      plugins: [svgr(), react(), tsconfigPaths()],
      server: {
        open: false,
		host: true,
		port: 5173
      },
	  preview: {
		host: true,
		port: 5173
	  },
      test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "src/setupTests",
        mockReset: true,
      },
    }
  }
})
