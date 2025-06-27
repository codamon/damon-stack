import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    "react", 
    "react-dom", 
    "@tanstack/react-query",
    "@trpc/client",
    "@trpc/react-query",
    "@trpc/server",
    "superjson",
    "zod"
  ],
  banner: {
    js: "'use client';",
  },
  treeshake: true,
  minify: false,
  target: "es2022"
}); 