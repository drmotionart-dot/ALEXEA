import { chromium } from 'playwright';
import fs from 'fs';

const base = "https://alexea.vercel.app";
const outDir = "C:\\Users\\Abdo Essam\\Desktop\\screenshots";
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) fs.unlinkSync(outDir + "\\" + f);

const pages = [
  { name: "home", path: "/home.html" },
  { name: "calendar", path: "/calendar.html" },
  { name: "hands-on", path: "/hands-on.html" },
  { name: "attendance", path: "/attendance.html" },
  { name: "tools", path: "/tools.html" },
  { name: "candidates", path: "/import.html" },
  { name: "account", path: "/accounts.html" },
  { name: "activity", path: "/activity.html" },
];

const browser = await chromium.launch({ headless: true });
for (const dark of [false, true]) {
  for (const w of [390, 1280]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: dark ? 'dark' : 'light' });
    await ctx.addInitScript((args) => {
      localStorage.setItem('token', args.token);
      localStorage.setItem('user', JSON.stringify(args.user));
    }, { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWUxYjFhMmM0ZDU5ZWI1ZWM2ZWJmNSIsImlhdCI6MTc5NDAxODM0MiwiZXhwIjoxNzk0NjIzMTQyfQ.DkiyuQ1RgTeUj8gYw1-p1JpUAJGIg3Q6E-1U9aXprGQ", user: {"id":"6aee1b1a2c4d59eb5ec6ebf5","name":"dr admin","username":"admin","role":"head"} });
    const page = await ctx.newPage();
    for (const pg of pages) {
      await page.goto(base + pg.path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      const fname = `${pg.name}-${w}-${dark?'dark':'light'}.png`;
      await page.screenshot({ path: `${outDir}\\${fname}`, fullPage: true });
      console.log("saved", fname);
    }
    await ctx.close();
  }
}
await browser.close();
console.log("done");