import { mkdirSync, writeFileSync } from 'node:fs';

// SWPT moved to its own site. Old links to fathomsolutions.dev/SWPT/ (and /swpt/)
// get a static redirect page, since GitHub Pages can't issue server-side 301s.
const target = 'https://swpt.dev/';

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SWPT has moved to swpt.dev</title>
  <link rel="canonical" href="${target}">
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0; url=${target}">
  <script>location.replace('${target}' + location.search + location.hash);</script>
</head>
<body>
  <p>SWPT has moved to <a href="${target}">swpt.dev</a>.</p>
</body>
</html>
`;

// GitHub Pages paths are case-sensitive, so cover both spellings.
for (const dir of ['SWPT', 'swpt']) {
  const out = new URL(`../dist/${dir}/`, import.meta.url);
  mkdirSync(out, { recursive: true });
  writeFileSync(new URL('index.html', out), html);
  console.log(`Wrote SWPT redirect -> dist/${dir}/index.html`);
}
