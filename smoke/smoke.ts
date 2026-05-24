import { chromium } from "playwright";
import { spawn } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const window: any; // Playwright evaluates in browser; this is Node-side shim
}

const ROOT = join(__dirname, "..");
const PORT = 8765;
const URL = `http://localhost:${PORT}/smoke/smoke.html`;

async function runSmoke() {
  // 1. Start HTTP server
  const server = spawn("python3", ["-m", "http.server", String(PORT)], {
    cwd: ROOT,
    stdio: "pipe",
    env: { ...process.env, PYTHONUNBUFFERED: "1" },
  });

  // Wait for server ready
  await new Promise((res) => setTimeout(res, 1200));

  // 2. Launch headless Chromium
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000); // WASM bootstrap

    const result = await page.evaluate(() => {
      // @ts-ignore — `window` exists only inside the browser evaluation context
      return (window as any).smokeResult;
    });
    console.log("\n========== ESSENTIA BROWSER SMOKE RESULT ==========");
    console.log(JSON.stringify(result, null, 2));
    console.log("===================================================\n");

    if (!result || !result.loaded) {
      throw new Error(`Essentia failed to load: ${result?.error || "unknown"}`);
    }
    if (!result.hasPercival) throw new Error("PercivalBpmEstimator missing");
    if (!result.hasKey) throw new Error("KeyExtractor missing");
    if (typeof result.bpm !== "number") throw new Error("BPM not a number");
    if (typeof result.key !== "string" || !result.key) throw new Error("Key not a string");

    console.log("✅ Browser smoke test PASSED");
  } finally {
    await browser.close();
    server.kill();
  }
}

runSmoke().catch((err) => {
  console.error("❌ Browser smoke test FAILED:", err.message);
  process.exit(1);
});
