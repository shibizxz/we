# WEBAPPZZ TECHNOLOGIES website

Static company website for `WEBAPPZZ TECHNOLOGIES`, ready for GitHub Pages hosting and domain connection.

## Pages

- `index.html` — home: hero, what we build, featured work, process, CTA
- `services.html` — full service list plus the five-stage process
- `works.html` — live projects with screenshots and published domains
- `packages.html` — pricing packages (Starter / Growth / Scale)
- `contact.html` — WhatsApp, email, and a form that opens WhatsApp prefilled
- `privacy.html` — privacy policy
- `robots.txt` — crawl rules pointing search engines to the sitemap
- `sitemap.xml` — public page sitemap for `https://webappzz.com/`
- `styles.css` — shared design system (dark theme drawn from the logo gradient)
- `script.js` — mobile nav, scroll reveal, contact form → WhatsApp

## Quick edits

- Add a new project: copy a `work-card` block in `works.html` (and on `index.html` if featured), drop the screenshot into `assets/`
- Add a domain: copy a `domain-chip` link in `works.html`
- Change packages: edit the lists in `packages.html`
- Brand colors live in the `:root` block at the top of `styles.css`
- If the live domain changes, update `https://webappzz.com/` in the page metadata, `robots.txt`, and `sitemap.xml`
