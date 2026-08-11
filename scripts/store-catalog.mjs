// Renders a single image of every store item — on-body and as a thumbnail —
// so the catalog can be reviewed at a glance when deciding what art to add
// next. Usage (with the dev server running):
//   node scripts/store-catalog.mjs http://localhost:5173 out.png
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:5173";
const out = process.argv[3] ?? "store-catalog.png";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 2 });
await page.goto(`${base}/preview`, { waitUntil: "domcontentloaded" });
// Wait for the content itself, not a fixed delay — a cold dev-server compile
// can easily outlast any timeout, and trimming an unmounted page silently
// produces the full, untrimmed screenshot instead.
await page.locator('h2:has-text("Store thumbnails")').first().waitFor({ timeout: 60000 });
await page.waitForTimeout(600);

// Hide the non-store sections with CSS rather than removing the nodes: a
// React re-render restores anything detached from the DOM, which silently
// yields the full untrimmed page instead of the catalog.
await page.addStyleTag({
  content: `
    div[data-section] { display: none !important; }
    div[data-section^="Store items equipped"],
    div[data-section^="Store items at the physique"],
    div[data-section^="Store thumbnails"] { display: block !important; }
  `,
});
await page.waitForTimeout(400);

await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("wrote", out);
