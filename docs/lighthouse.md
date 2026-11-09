# Lighthouse results (mobile)

Run on 2026-11-09 against a local production build (`npm run build && npm start`), Lighthouse default mobile profile (simulated slow 4G, 4x CPU slowdown), Microsoft Edge headless, on a development laptop whose Lighthouse benchmark index was only 700 to 1,200 (a slow machine, so CPU-bound scores are pessimistic and noisy). All images were still branded placeholders and there was no real hero photograph.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home | 58 to 65 (varies run to run) | 100 | 100 | 100 | 3.5 to 3.8 s | 0 | 0.7 to 2.5 s |
| Product (shower gel) | 77 | 100 | 100 | 100 | 3.5 s | 0 | 0.56 s |
| Privacy (plain page, baseline) | 83 | not measured | not measured | not measured | 0.8 s | 0 | 0.71 s |

## Status against the target (90 or more on all four)

- **Accessibility, Best Practices, SEO: 100 on both pages. Target met.**
- **Performance: NOT met.** Home is about 60 and the product page about 77. The definition of done for this item is therefore **not complete**.

## What was found and done

- Total JavaScript is small (about 118 KB gzipped across chunks); the cost is main-thread time (blocking time, hydration, style and layout), not download size. Even the plain privacy page shows about 0.7 s of blocking time on this machine, so a good part of the gap is the test machine.
- Fixed: forced reflow in the scroll-reveal component; pattern SVG inlined so the hero panel does not wait on a request; removed `backdrop-blur` on the header and `text-wrap: pretty`. These were small gains (home moved from about 65 to about 71 on one run) and results stayed noisy.
- LCP was the hero placeholder panel. With a real, preloaded, compressed hero image (`priority` is already wired to preload and `fetchpriority=high`), LCP should change; this needs re-measuring.

## Recommended next steps

1. Re-run on a faster machine or with PageSpeed Insights against the deployed Vercel URL, after the real hero and photography are in.
2. If blocking time is still high, reduce hydration on the home page (for example fewer `Reveal` wrappers, or only reveal the scent story) and profile with the Chrome Performance panel.
3. Keep every real photograph under the size limits in the README.
