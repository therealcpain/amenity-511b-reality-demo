# 511(b) Amenity Reality

**Paste (1) travel / view date vs Oct 19 2026, (2) what the airline / gate agent said caused the delay (cause chip), (3) overnight stranded? yes/no → one shareable card:**  
giant **Amenity-likely** / **Amenity-unlikely** / **Pre-rule** / **Unsure** badge · “meals/hotels hinge on *controllable*” strip · 511(b) ten-event membership when applicable · Oct 19 countdown (pre) or post-effective chip · refund-rights-are-SEPARATE footer (flightrights.gov / transportation.gov / Gate Rights pointer).

Brand on the surface: **511(b) Amenity Reality** only.

**Not legal advice. Not a claim filer.** Amenities are airline-specific commitments. We never invent the airline’s official BTS code or a $ hotel/meal amount. User-pasted cause chips only — zero PNR scrape.

## Hypothesis

After Oct 19 2026, passengers stranded overnight on “mechanical / medical / unruly” hear “outside our control — no hotel” and confuse **ticket refund** rights with **meal/hotel** amenities. Flip that into a **cause-honest share card** — without filing complaints or scraping PNRs. Success = “is unscheduled MX still a hotel?” shares around the Oct 19 cliff.

## How to test (local)

```bash
cd kb/mde/amenity-511b-reality
npm run build          # copies assets → dist/
npm run verify         # Oct 19 gate + ten-event + amenity chips + brand-clean
# either open the file:
open index.html        # or dist/index.html
# or serve:
npm start              # http://localhost:4245
```

Manual checklist:

1. Open the page → click **Unscheduled MX · overnight · post-Oct19** → giant **Amenity-unlikely**, 511(b) ten-event strip, post-effective chip, refund≠amenities footer.
2. Click **Medical emergency · post-Oct19** → Amenity-unlikely.
3. Click **Weather / NAS** → Amenity-unlikely (uncontrollable framing).
4. Click **Pre-Oct19 MX** → **Pre-rule** · still shows would-be Amenity-unlikely after Oct 19 · countdown to Oct 19.
5. Click **Other controllable · post-Oct19** → **Amenity-likely**.
6. Click **Empty / missing date** → honest miss (no invented Oct 19 math).
7. Paste your own date + cause + overnight → **Show amenity card**.
8. Missing travel/view date → honest status.
9. **Copy summary** → clipboard has amenity badge + cites.
10. **Share link** → `#p=` restores the card.
11. **Export PNG** → dark card with Amenity-likely/unlikely/Pre-rule/Unsure text + **disclaimer** + refund≠amenities on the face.
12. Surface brand is **511(b) Amenity Reality** only (no house / personal names).

### GitHub Pages

This folder is static-ready. Point Pages at `/` of a dedicated repo (or `/docs` after copying `dist/`), with `index.html` at the site root. Relative paths (`styles.css`, `app.js`) work on project pages.

```bash
npm run build   # optional artifact in dist/
```

Do **not** create the public repo or post from this build step — Steward handles Pages + distro. Distro stays product-linked only (e.g. r/travel, r/Flights, FlyerTalk delay threads, Sep 15–Oct 25). **No sock accounts.** No partisan creative on the share PNG.

## Seed cohort (MVP)

Labeled teaching scenarios — not live airline scrapes. Never invent a carrier’s official BTS code or $ amenity amount.

| Chip | Inputs | Teaching point |
|------|--------|----------------|
| Unscheduled MX · overnight · post-Oct19 | 2026-10-20 · mx · overnight yes | Amenity-unlikely · 511(b) ten-event |
| Medical emergency · post-Oct19 | 2026-10-25 · medical | Amenity-unlikely |
| Weather / NAS | 2026-10-20 · weather_nas · overnight | Amenity-unlikely · uncontrollable |
| Pre-Oct19 MX | 2026-09-13 · mx · overnight | Pre-rule · would be unlikely after |
| Other controllable · post-Oct19 | 2026-10-22 · other_controllable | Amenity-likely |
| Empty / missing date | blank date · mx | Honest miss |

## Amenity logic (public FR framing)

| Rule | Framing |
|------|---------|
| Pre-rule | Travel/view date **&lt; Oct 19 2026** → **Pre-rule**; still show post-Oct19 amenity bucket for the cause |
| Amenity-unlikely (511(b)) | Date ≥ Oct 19 **and** cause ∈ ten statutory 511(b) events |
| Amenity-likely | Date ≥ Oct 19 **and** other Air Carrier controllable |
| Amenity-unlikely (uncontrollable) | Weather / NAS / security / late aircraft |
| Unsure | Cause chip = unsure — no invented BTS code |
| Overnight | Hotel expectation especially sensitive under 511(b) framing (text note only — no $) |
| Refunds ≠ amenities | Footer + PNG: cancel/significant-change refund rights are SEPARATE — flightrights.gov / transportation.gov / Gate Rights |
| Dollars / BTS | **Never invent** hotel/meal $ or airline official BTS code |

### The ten 511(b) events (FR Sep 3 2026 / 2026-18040)

Unscheduled non-deferrable maintenance · medical emergency · unruly passenger removal · compliant cybersecurity attack · unexpected gov system failure · aircraft damage (weather/FOD/sabotage) · bag-system outage (not carrier/contractor-controlled) · overheated brakes · passenger-death cleaning · airport closure from volcanic ash/wind/wind shear.

## Ads pathway (ad-only free utility — do not spend yet)

| Path | Notes |
|------|--------|
| **Revenue (primary)** | **AdSense / display under the card + “what is DOT Section 511(b) and do I still get a hotel?” explainer** (not inside the PNG). Inventory spikes Sep 15–Oct 31 and on major disruption news days. Justified when sessions cover hosting. Free card forever — **no paywall**, **no Gumroad**. |
| **Brand-safe** | Informational cause→amenity literacy from public FR / Crowell / VFTW / Simple Flying cites. **Not** legal advice. Ads **not** inside PNG. **Hard avoid** travel-insurance hard-sell that overclaims coverage for mechanicals; soft “check card trip-delay fine print” pointer only if ever used. |
| **Sponsorship (later)** | Optional brand-safe travel-literacy sponsorship only. |
| **Acquisition (gated)** | Google “DOT 511(b) delay hotel” / “airline controllable delay meal voucher October 2026” + Reddit promo after Sep 4–5 recirculation. Creative = “Paste what they said caused it — still amenity-likely after Oct 19?”. Max CPA abort ~$0.30–0.50 without a completed share. Debit/cash only. **Spend only after one organic Flights-thread test.** |
| **UTM** | Example: `?utm_source=reddit&utm_medium=organic&utm_campaign=amenity_511b_reality_mvp` |
| **Tracking** | Card gens + share clicks (GoatCounter path when Pages is live). |
| **Abort sketch** | Pause paid if CPA exceeds band without share / “still amenity-likely?” replies. |

**No spend from this ready_for_pages step.** Ads are the monetization path (**ad-only OK**).

## Product constraints

- Single static site (no backend).
- **Flags only from user paste** (or labeled seeds). Never invent BTS codes, eligibility beyond paste, or $ amenity amounts.
- Brand: **511(b) Amenity Reality** only on surface.
- Amenity-likely / Amenity-unlikely / Pre-rule / Unsure text-labeled (not color-only; `text-primary`). Disclaimer always visible on page + share PNG.
- Share = URL hash + PNG + copy summary.
- No PNR scrape. No claim filer. No Gate Rights refund-logic clone. No sock farms. Hard-avoid travel-insurance overclaim.

## Files

| Path | Role |
|------|------|
| `index.html` | App shell (GitHub Pages entry) |
| `app.js` | Oct 19 gate, ten-event membership, amenity chips, seeds, card, share hash, PNG |
| `styles.css` | 511(b) Amenity Reality UI |
| `scripts/build.js` | `npm run build` → `dist/` |
| `scripts/verify.js` | `npm run verify` — Oct 19 + ten-event + honest states |
| `package.json` | build / start / preview / verify scripts |

## Opportunity

Internal card: `opp_travel_511b_amenity_reality` (travel / delay amenities).  
Experiment stub: `institutions/mde/experiments/exp_511b_amenity_reality.md`.
