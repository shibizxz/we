# WEBAPPZZ TECHNOLOGIES

Responsive digital studio website with service landing pages, project case studies, local-business signals, and enquiry tools. Plain HTML, CSS, and JavaScript; no frontend build dependencies.

## Experience

- Dark and light themes, saved locally when browser storage is available.
- Sticky navigation with mobile menu, keyboard dismissal, scroll progress, and back-to-top control.
- Scroll reveals and project hover motion that respect reduced-motion preferences.
- Four-step project planner with editable answers and tailored recommendations. Answers carry into the enquiry form through URL parameters, with session storage as a fallback.
- Searchable portfolio with combined industry filters, result count, and resettable empty state.
- Package comparison with an option to show only differences.
- Validated enquiry form with brief review, WhatsApp and email handoff, copy, and plain-text download. Messages are never automatically sent. Personal form fields are not saved by the website.
- Service section shortcuts and native FAQ disclosures.

## Pages

The main navigation pages share `styles.css`, `script.js`, and `carousel.js`. Six focused service pages and four project case studies give search engines and visitors a clear page for each offer and proof point. Client screenshots and brand assets are in `assets/`.

## Local development

Serve this directory with a local HTTP server. Run `npm run build` to create the deployment output. Run `npm run validate` to check metadata, structured data, local links, assets, and anchor targets. After a live deployment, `npm run submit:indexnow` submits the sitemap URLs to IndexNow for participating search engines. Browser checks are recorded in `QA.md`.

## Content updates

Update package scope in `packages.html`; no fixed prices are invented. Update the project planner recommendations in `script.js` when service scope changes. Update contact destinations consistently in the HTML and `script.js`. New portfolio cards need `data-category` and a unique `id`.

The existing Sites project is recorded in `.openai/hosting.json`. Source metadata continues to use the company's `https://webappzz.com/` canonical domain.

## Search and AI discovery

Every public page has a canonical URL, descriptive title and summary, share metadata, crawl directives, responsive social image, and internal links. `sitemap.xml`, `robots.txt`, and `llms.txt` expose the public structure to conventional and AI search crawlers. Schema.org data describes the business, website, services, location, contact routes, and public case studies. Fonts are self-hosted and portfolio images have responsive WebP variants to improve loading speed.

## UAE software and growth services

The homepage and Work page include an anonymous overview of UAE in-house billing software engagements. It is an aggregate showcase, not a named case study; client names and internal screens remain private. Portfolio filters include Business software and UAE work. SEO, Google Business Profile, and digital marketing services are linked to prefilled enquiry forms. The planner supports business software and marketing recommendations.

## Mobile carousels

`carousel.js` progressively enhances groups marked `data-carousel="Accessible section name"` below 761px. Every phone carousel advances automatically while visible, every 4–6 seconds depending on card length, with optional `data-interval` overrides. The track fits the active card's natural height; ResizeObserver handles font, content, and width changes. Swiping holds movement for five seconds before the next slide interval; keyboard focus pauses it until focus leaves the carousel. There are no playback buttons, arrows, dots, or counters. Reduced-motion preferences and background tabs disable or suspend automatic movement. Desktop grids, portfolio filters, and direct service/project links are preserved.

The homepage capability banner loops at approximately 55 pixels per second on desktop and mobile. Its duplicate label group is hidden from screen readers. Hover pauses it; reduced-motion mode restores a static wrapping list. The banner spans the viewport and each visual group covers at least one full viewport, including on 4K screens.

## Full-width layout

Section backgrounds and enquiry bands span the viewport. Content stays centered within 1480px with fluid side gutters. Mobile retains 18px gutters and compact spacing. Large-screen image sizing is bounded so content does not stretch indefinitely.
