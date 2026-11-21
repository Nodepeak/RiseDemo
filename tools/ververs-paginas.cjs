// Gebruik: start `python3 -m http.server 8123` in de repo-root en draai `node tools/ververs-paginas.cjs`.
// Ververs de vooraf gerenderde markup in elke statische pagina, zodat de eerste paint al het nieuwe ontwerp toont.
const { chromium } = require('playwright');
const fs = require('fs');
const { execSync } = require('child_process');
(async () => {
  const files = execSync("git ls-files '*.html'", { cwd: process.cwd() }).toString().trim().split('\n');
  const b = await chromium.launch();
  for (const f of files) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
    const p = await ctx.newPage();
    p.on('pageerror', e => console.log('ERR', f, e.message));
    await p.goto('http://localhost:8123/' + f);
    await p.waitForTimeout(400);
    const inner = await p.evaluate(() => document.getElementById('app').innerHTML);
    const src = fs.readFileSync(f, 'utf8');
    const start = src.indexOf('<div id="app" class="app">') + '<div id="app" class="app">'.length;
    const end = src.lastIndexOf('</div>', src.indexOf('</body>'));
    if (start < 30 || end < start) { console.log('skip', f); continue; }
    fs.writeFileSync(f, src.slice(0, start) + '\n' + inner.trim() + '\n  ' + src.slice(end));
    await ctx.close();
  }
  await b.close();
  console.log('regenerated', files.length);
})();
