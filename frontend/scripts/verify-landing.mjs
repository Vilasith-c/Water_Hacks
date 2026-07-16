import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

const desktop = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1,
});
await desktop.goto("http://127.0.0.1:3010/", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await desktop.screenshot({ path: "landing-desktop.png", fullPage: true });
const desktopTitle = await desktop.locator("h1").first().innerText();
const desktopCopy = await desktop.locator("body").innerText();

const mobile = await browser.newPage({
  viewport: { width: 390, height: 1000 },
  isMobile: true,
});
await mobile.goto("http://127.0.0.1:3010/", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await mobile.screenshot({ path: "landing-mobile.png", fullPage: true });
const mobileOverflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
);

await browser.close();

console.log(JSON.stringify({
  desktopTitle,
  mobileOverflow,
  hasHeroCopy: desktopCopy.includes("One workspace for projects"),
  hasDashboardPreview: desktopCopy.includes("Policy answer source map"),
  screenshots: ["landing-desktop.png", "landing-mobile.png"],
}, null, 2));
