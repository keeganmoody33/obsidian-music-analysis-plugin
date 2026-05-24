import { chromium } from "playwright";
import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { extname } from "path";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(join(__dirname, ".."));

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".f32": "application/octet-stream",
  ".wasm": "application/wasm",
};

function sanitizeUrl(url) {
  let p = url.split("?")[0] || "/";
  while (p.includes("..")) p = p.replace("..", "");
  while (p.startsWith("/")) p = p.slice(1);
  return p;
}

function startServer() {
  return new Promise((res) => {
    const srv = createServer((req, resp) => {
      const safePath = sanitizeUrl(req.url);
      const filePath = join(ROOT, safePath);
      if (!filePath.startsWith(ROOT) || !existsSync(filePath)) {
        resp.statusCode = 404;
        resp.end("Not found");
        return;
      }
      const ext = extname(filePath);
      resp.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
      resp.end(readFileSync(filePath));
    });
    srv.listen(0, "127.0.0.1", () => {
      const port = srv.address().port;
      res({ srv, url: `http://127.0.0.1:${port}/smoke/batch-instrumentals.html` });
    });
  });
}

async function runTest() {
  const { srv, url } = await startServer();
  console.log("Serving from", url);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on("console", (msg) => console.log("[BROWSER]", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.error("[BROWSER ERROR]", err.message));

  try {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(15000); // longer for 3 files

    const text = await page.$eval("#output", (el) => el.textContent);
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Invalid JSON:", text.substring(0, 300));
      throw new Error("Page returned invalid JSON");
    }

    console.log("\n========== BATCH INSTRUMENTAL RESULTS ==========");
    console.log(JSON.stringify(data, null, 2));
    console.log("=================================================\n");

    if (!data.loaded) throw new Error("WASM load failed: " + data.error);

    for (const [name, t] of Object.entries(data.tests)) {
      console.log(`\ud83c\udfa7 ${name}:`);
      console.log(`  BPM: ${t.bpm} (raw ${t.rawBpm}) ${t.alternateTempo ? `[alt: ${t.alternateTempo}]` : ''}`);
      console.log(`  Key: ${t.key} ${t.scale} (strength ${t.strength?.toFixed(3)})`);
      console.log(`  Confidence: ${t.confidence > 0.738 ? '✅ above' : '❌ BELOW'} threshold (0.738)`);
      console.log(`  Duration: ${t.duration}s`);
    }
  } finally {
    await browser.close();
    srv.close();
  }
}

runTest().catch((err) => {
  console.error("\nBATCH SMOKE FAILED:", err.message);
  process.exit(1);
});
