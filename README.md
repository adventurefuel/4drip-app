# 4DRIP — unified site

A static, no-build-step site: the homepage (`index.html`), the public shop
(`shop.html`), and the admin bulk-upload tool (`admin.html`) — all reading
and writing directly to Supabase via `@supabase/supabase-js` in the browser.
No custom backend server; Supabase (Postgres + Auth + Storage) is the backend.

## Structure

- `index.html` — homepage. Same design as the original QR landing page.
- `shop.html` — public, searchable inventory grid. Reads live from the
  `products` table. Every item has a WhatsApp CTA prefilled with the
  product's brand/name/SKU, pointed at **(586) 553-5504**.
- `admin.html` — sign-in gated bulk inventory tool for Tarmale & Jay:
  CSV bulk upload + photo matching, a review table, publish-to-store, and a
  live-editable current-inventory table (edit stock/status, remove items).
- `assets/styles.css` — shared design tokens (pulled from the 4DRIP Design
  Guide: Ink/near-black background, Yellow/Teal/Orange accents, Anton +
  Archivo + JetBrains Mono).
- `assets/supabase-client.js` — Supabase client + WhatsApp link helpers.
  **Only holds the public anon key** — safe to expose in client code;
  every write is enforced server-side by Postgres Row Level Security (RLS).

## Supabase project

Project: **4drip** (`huoortkwcgaqztgndxns`), org "ADventure Fuel", region us-east-2.

- URL: `https://huoortkwcgaqztgndxns.supabase.co`
- Anon/public key: baked into `assets/supabase-client.js` (already done).

Schema (see migrations `init_4drip_schema` and `product_images_storage_bucket`
in the Supabase dashboard for the exact SQL):

- `public.products` — sku, brand, name, category, sizes (text[]), stock,
  condition, fit, description, status, images (text[]), timestamps.
  RLS: anyone can `select`; only rows in `public.admins` can insert/update/delete.
- `public.admins` — allowlist of `auth.users.id` who may edit inventory.
  Starts **empty** — see "First-time admin setup" below.
- Storage bucket `product-images` — public read, admin-only write.

Four demo listings (`4D-2001`–`4D-2004`) were seeded with the sample product
photos from the design guide so the shop isn't empty on first load. Delete
or replace them from `admin.html` once real inventory is in.

## First-time admin setup

There's no signup form anywhere public — only `admin.html`'s "Create an
account" flow, and a brand-new account has **no edit access** until it's
added to the `admins` allowlist. To get Tarmale and Jay set up:

1. Each of you opens `/admin.html`, clicks **Create an account**, and signs
   up with your email + a password. Supabase may send a confirmation email —
   click it, then sign in.
2. You'll land on an "Account pending approval" screen. That's expected —
   send the confirmation to whoever's finishing the setup.
3. In the Supabase dashboard for the `4drip` project, run this SQL once per
   person (Table Editor → SQL, or ask Claude to run it):
   ```sql
   insert into public.admins (id, email)
   select id, email from auth.users where email = 'the-persons-email@example.com';
   ```
4. Refresh `/admin.html` — the bulk-upload tool unlocks.

## Local development

No build step. Any static file server works:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.

## Deployment (Render)

Deployed as a Render **Static Site** from the GitHub repo, publish directory
`app/` (or repo root if the repo *is* this folder). No build command needed
— it's plain HTML/CSS/JS. Add a redirect/rewrite rule only if you later want
clean URLs; not required for this v1.

## WhatsApp number

`15865535504` (+1 586 553 5504) is set in `assets/supabase-client.js`
(`WA_NUMBER`) and used everywhere — the nav, the shop cards, the floating
button, and the homepage's Message action. Change it in that one file if it
ever needs to change.
