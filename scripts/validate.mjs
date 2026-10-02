import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const pages = readdirSync('.').filter(file => file.endsWith('.html'));
const errors = [];
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${page}: duplicate id`);
  for (const required of ['<title>', 'name="description"', 'name="viewport"', 'rel="canonical"', 'name="robots"', 'id="main"', 'aria-label="Main navigation"']) {
    if (!html.includes(required)) errors.push(`${page}: missing ${required}`);
  }
  if ([...html.matchAll(/<h1[ >]/g)].length !== 1) errors.push(`${page}: expected one h1`);
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json); } catch (error) { errors.push(`${page}: invalid JSON-LD (${error.message})`); }
  }
  for (const [, reference] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:|data:)/.test(reference)) continue;
    const [url, anchor] = reference.split('#');
    const target = url.split('?')[0] || page;
    if (!existsSync(resolve(target))) errors.push(`${page}: missing ${target}`);
    else if (anchor && target.endsWith('.html')) {
      const content = readFileSync(target, 'utf8');
      if (!content.includes(`id="${anchor}"`)) errors.push(`${page}: missing anchor ${reference}`);
    }
  }
}
for (const required of ['robots.txt', 'sitemap.xml', 'llms.txt', 'site.webmanifest']) {
  if (!existsSync(resolve(required))) errors.push(`missing ${required}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${pages.length} pages: metadata, structured data, local assets, links, and anchors.`);
