import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
      react: "src/react.ts",
      node: "src/node.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    treeshake: true,
    target: "es2020",
    outDir: "dist",
    external: [
      "react",
      "react-dom",
      "react-native",
      "react-native-svg",
      "canvas",
      "jsdom",
    ],
    cjsInterop: true,
    esbuildOptions(options) {
      options.jsx = "automatic";
    },
  },
  {
    entry: {
      native: "src/native.ts",
    },
    format: ["esm", "cjs"],
    dts: false,
    sourcemap: true,
    clean: false,
    splitting: false,
    treeshake: true,
    target: "es2020",
    outDir: "dist",
    external: [
      "react",
      "react-dom",
      "react-native",
      "react-native-svg",
      "canvas",
      "jsdom",
    ],
    cjsInterop: true,
    esbuildOptions(options) {
      options.jsx = "automatic";
    },
  },
]);
