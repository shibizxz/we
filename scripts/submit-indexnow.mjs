import { readFileSync } from 'node:fs';

const host = 'webappzz.com';
const key = 'a76b173ce53f4c1ca355527b2b45cc68';
const sitemap = readFileSync('sitemap.xml', 'utf8');
const urlList = [...sitemap.matchAll(/<loc>(https:\/\/webappzz\.com\/[^<]*)<\/loc>/g)].map(match => match[1]);

if (!urlList.length) throw new Error('No webappzz.com URLs were found in sitemap.xml.');

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList })
});

if (!response.ok) throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`);
console.log(`Submitted ${urlList.length} URLs to IndexNow.`);
