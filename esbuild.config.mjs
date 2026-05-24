import esbuild from "esbuild";
import fs from "fs/promises";
import path from "path";

const production = process.argv[2] === "production";

async function copyWasm() {
  // Copy the WASM file to dist/ so the worker can embed it as base64
  const wasmSource = "./node_modules/essentia.js/dist/essentia-wasm.web.wasm";
  const wasmDest = "./dist/essentia-wasm.web.wasm";
  await fs.mkdir("./dist", { recursive: true });
  await fs.copyFile(wasmSource, wasmDest);
  console.log("WASM copied to dist/");
}

const baseConfig = {
  bundle: true,
  color: true,
  logLevel: "info",
  target: "es2020",
};

async function buildMain() {
  await esbuild.build({
    ...baseConfig,
    entryPoints: ["src/main.ts"],
    outfile: "dist/main.js",
    platform: "browser",
    format: "cjs",
    external: ["obsidian"],
    define: {
      "process.env.NODE_ENV": production ? '"production"' : '"development"',
    },
    sourcemap: production ? false : "inline",
  });
}

async function buildWorker() {
  await esbuild.build({
    ...baseConfig,
    entryPoints: ["src/worker.ts"],
    outfile: "dist/worker.js",
    platform: "browser",
    format: "iife",
    define: {
      "process.env.NODE_ENV": production ? '"production"' : '"development"',
    },
    sourcemap: production ? false : "inline",
    // Bundle essentia JS API into the worker; WASM loaded separately
    loader: {
      ".wasm": "binary",
    },
    alias: {
      fs: "./stubs/fs.js",
      path: "./stubs/path.js",
    },
  });
}

async function build() {
  await copyWasm();
  await buildMain();
  await buildWorker();
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
