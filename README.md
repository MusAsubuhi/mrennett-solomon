# Mrennett website

A mobile-first marketing and ordering site for Mrennett (shower gel, hand wash, fabric softener, reed diffuser). Built with Next.js (App Router), TypeScript and Tailwind CSS. Orders are sent over WhatsApp; there is no database and no payment processor in phase one.

## Run it

```bash
npm install
cp .env.example .env.local     # then fill in what you know (see below)
npm run dev                    # http://localhost:3000
npm run build && npm start     # production build
```

In development (and on Vercel preview deployments) you see dashed "Content needed" boxes, image-slot hints and "Draft" flags. In a real production build all of these are hidden, and a section whose content is still a placeholder is left out. Set `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true` to see the hints on a deployed preview.

Settings in `.env.local`: `NEXT_PUBLIC_SITE_URL` (live address), `NEXT_PUBLIC_WHATSAPP_NUMBER` (international format, no plus sign; until it is set, order buttons say "ordering opens soon"), `NEXT_PUBLIC_CURRENCY` (default `KES`, an assumption), `NEXT_PUBLIC_ANALYTICS_ID` (optional, a Plausible site domain), `NEWSLETTER_PROVIDER_KEY` (optional, server only).

## Swap a photo (five steps)

1. Save the file under `public/images/...` at the path listed for that slot in `content/images.json`.
2. Use lowercase file names with hyphens. Keep in-page images under 400 KB and the hero under 700 KB.
3. In `content/images.json`, set that slot's `"status"` to `"final"`.
4. Check the `alt` text describes the picture.
5. Run `npm run images:status` to confirm. No code changes are needed.

`npm run check:images` is the launch gate: it fails while any slot is still `"placeholder"` or any alt text is empty. Use `-- --allow-placeholders` for staging.

The temporary hero is the owner's concept image: save it as `reference/solos-concept.jpg` and `npm run dev` / `npm run build` copy it to `public/images/home/hero.jpg`. It stays marked `placeholder` until real photography replaces it.

## Change a price, a sentence or a product

- **Price:** in `content/products.json`, set `"price": 450` and `"priceConfirmed": true`. Until both are set the site shows "Ask for price".
- **Scent notes, ingredients, how to use, description:** fill the field in the same file. Layered notes show only when `notesConfirmed` is true. Fields left `null` stay hidden in production.
- **Any other copy:** `content/site.json` (brand, contact, delivery, home headings), `content/about.json`, `content/faq.json`, `content/places.json`, `content/moods.json`, `content/quiz.json`, `content/privacy.md`, `content/terms.md`.
- **Set discount:** `bundleDiscountPercent` in `content/site.json` (0 shows only the total).
- **Add a product:** copy an object in `content/products.json`, give it a new `id` and `slug`, then add its four image slots (`product.<id>.packshot`, `.label-detail`, `.lifestyle`, `.in-use`) to `content/images.json`. The shop, quiz and ritual builder pick it up automatically.
- **Add a journal post:** add `content/journal/<slug>.mdx` with `title`, `date`, `excerpt`, `products` and `draft`, plus a `journal.<slug>.cover` slot. Remove `draft: true` to publish.

Bad content fails the build with a message naming the file and field (`npm run validate`).

Unknown content is `null` or `"[[TODO: ...]]"`. Never invent prices, claims, reviews or ingredients: put real, evidenced claims in a product's `claims` array with an `evidence` note.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run images:status` | Table of every image slot, its status and whether the file exists |
| `npm run check:images` | Launch gate (errors on placeholders and empty alt text) |
| `npm run todo` | Writes `TODO-CONTENT.md`, every open placeholder grouped by page |
| `npm run validate` | Validates all content (also runs before every build) |
| `npm run check:contrast` | Checks every text and background colour pair against WCAG AA |
| `npm run test:e2e` | Playwright smoke test on a 360 px phone viewport (needs Edge, or `PW_CHANNEL=chrome`) |
| `npm run images:generate -- --force` | Rebuilds `images.json` from scratch (loses edits) |

## Where things live

`content/` all editable copy and data · `public/images`, `public/brand` image files · `src/app` routes · `src/components` (`ImageSlot`, `LabelFrame`, `ProductCard`, `Quiz`, `RitualBuilder`, ...) · `src/lib` cart, WhatsApp, SEO, content loaders · `src/app/globals.css` design tokens (all colours in one place).

Notes on choices: no Framer Motion (CSS and a small observer cover the motion, and it keeps the JavaScript small); the journal uses plain-Markdown `.mdx` files rendered by a small built-in renderer; analytics, when enabled, is Plausible-style and cookie-free.

## Known limitations

- **Quiz:** each scent mood currently has few products (bright and fresh have one each), so results feel thin until the range grows.
- **Payments:** the `PaymentProvider` in `src/lib/payments` is a stub. Add a provider there later.
- **Forms:** the newsletter and contact endpoints validate and rate-limit but store and send nothing until a provider is connected (see the HOOK comments in `src/app/api`). The rate limiter is in-memory and per server instance.
- **Logos, favicon and botanical art** are draft stand-ins made for the build.
- **Privacy and Terms** are drafts that need owner and legal review (including Kenya Data Protection Act, 2019 wording if the business operates in Kenya).
