# Redesign verification — 10 September 2026

- Checked all six routes at 320, 390, 768, and 1440 CSS pixels in the connected browser: no document-level horizontal overflow, no broken loaded images, and one primary heading per page.
- Visually reviewed the home page on desktop and phone, the mobile menu, service details, light-theme packages, and enquiry brief review.
- Completed a four-step mobile-app planner flow. Confirmed the resulting Startup Product recommendation, checked Flutter service, and transfer of “As soon as possible” to “Within 1 month”.
- Verified portfolio category filtering, search with no results, and filter reset.
- Verified comparison mode hides the two identical rows and retains four differing rows.
- Verified light-theme preference persists when navigating to another page.
- Verified mobile menu open/close behavior and Escape dismissal.
- Reviewed a test enquiry and checked its generated WhatsApp link contains the matching encoded brief. No enquiry was sent.
- Checked JavaScript syntax and local references with the repository validation script.

Limitations: browser viewport emulation, not testing on physical iOS or Android hardware. External client sites and final sending through third-party messaging apps are outside these checks.

## UAE software and marketing update — 11 September 2026

- Verified UAE work and software filters, with the anonymous software overview counted as one showcase.
- Verified software, SEO, and Google Business Profile links select the corresponding enquiry service.
- Completed the digital marketing planner and verified its growth recommendation, selected service, and empty software-package selection.
- Checked updated home, work, services, and contact pages at 320, 390, 768, and 1280 pixels: no document overflow or browser errors.
- Client company names, screenshots, project counts, performance claims, and testimonials were not invented.

## Mobile carousels — 11 September 2026

- Added native scroll-snap carousels below 761px for service previews, UAE software overview, featured/filtered projects, detailed services, packages, delivery steps, benefit cards, and contact next steps.
- Manual horizontal scrolling updated the project position from 1/4 to 2/4. Arrow buttons, numbered slide selectors, keyboard Home/End, and Show all / Show slider were verified.
- Verified service and project fragment links select the intended slide (SEO 7/9; Car Castle 3/4).
- Portfolio filtering handles one, multiple, and zero matching slides; resetting restores all slides.
- Confirmed service-preview autoplay progresses while visible, then remains at the same slide after Pause. Interaction pauses automatic motion.
- A temporary reduced-motion fixture confirmed automatic controls are disabled while manual navigation still works; fixture removed before build.
- Selected Business Growth from the package carousel and confirmed the contact form receives it.
- Checked all six pages at 320, 390, 760, 768, and 1280px: no document-level horizontal overflow. Desktop grids are retained above the mobile breakpoint.
- At 390px, initial page-height comparison: home 11,701 → 8,567px; services 8,000 → 4,146px; work 6,765 → 4,235px; packages 5,151 → 3,921px. Final compact project-cover styling further reduces the work cards.
- This is browser viewport testing, not physical-device testing. Forms, native FAQ disclosures, and privacy content are not placed in carousels.

## Automatic phone sections — 11 September 2026

Supersedes the earlier manual-controls design: all mobile carousels now autoplay; arrows, dot buttons, counters, and Show all are removed. Pause/Play remains. Swiping holds movement for 12 seconds before the next reading interval; explicit pause or keyboard/link focus requires Play to resume. All original slide content and links remain available.

- Verified automatic project advance at a 390px phone viewport (scroll position changed from 0 to 331px without interaction).
- Verified explicit Pause retains the same project position after the next normal reading interval.
- Verified Business software filtering leaves one card, hides unnecessary playback controls, and introduces no horizontal page overflow.
- JavaScript syntax, six-page metadata/link validation, and production build passed. Testing used browser viewport emulation.

## Compact cards and continuous banner — 11 September 2026

- Reduced autoplay intervals to 4–6 seconds and the swipe hold to five seconds. Replaced written playback labels with SVG icons and retained accessible button names.
- Replaced equal-height mobile slides with natural-height cards and a track that fits the active card. Verified the last, taller homepage marketing card has its full content and bottom padding visible.
- Reduced mobile section spacing, card padding, service-list spacing, and repeated software copy. At 390px, homepage service cards now range from 238–366px rather than stretching to the tallest card; the initial homepage document height is approximately 7,322px.
- Verified homepage autoplay advances, keyboard End selects the last card, and pause changes the accessible control state without visible text.
- Checked all six pages at 320, 390, 760, and 1280px: no document-level horizontal overflow. Desktop tracks have no residual inline mobile height.
- Verified the UAE filter includes billing software, Nabeel Dar Transport, and Kosmo Gulf. A single software result clears the track height and hides playback controls.
- Inspected the desktop banner: nine service labels, a continuous duplicate group hidden from accessibility APIs, moving transform, and icon playback control.
- JavaScript syntax, six-page metadata/link validation, and production build passed. Checks use browser emulation, not physical phones.

## iPhone arrows and footer — 11 September 2026

- Replaced 57 static directional text glyphs with monochrome, decorative SVG icons, plus the dynamically updated planner button arrow. This removes platform emoji substitution from navigation arrows.
- Removed the project-availability message from every footer and added bottom safe-area spacing for floating controls.
- Visually reviewed Services buttons and footer at 390px; checked all six pages at 320px for overflow, remaining directional text glyphs, and footer text. All passed.
- JavaScript syntax, page metadata/link validation, and production build passed. No physical iPhone or live GitHub Pages deployment was used for these checks.

## Full-width layout and control removal — 11 September 2026

- Removed playback controls from carousel and banner generation, including their empty control rows. Automatic movement remains; keyboard focus, hover, touch interaction, and reduced-motion preferences are respected.
- Set a shared centered 1480px content maximum with fluid gutters; sections, the service banner, and enquiry band span the available viewport width.
- Checked all six pages at 320, 390, 768, 1024, 1440, 1920, and 3840px: no document horizontal overflow or generated playback controls. Content caps at 1480px on large screens.
- Visually inspected the phone carousel and 4K homepage. Banner groups cover a full 4K viewport, avoiding empty loop tails; phone autoplay advanced with no controls present.
- JavaScript syntax, six-page metadata/link validation, and production build passed. These are emulated viewport checks; live deployment was not performed.
