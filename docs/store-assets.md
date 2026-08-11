# Store assets — what exists, and how to add more

## The 12 items that have real art today

| Item | Slot | Prestige | Aura | Look |
|---|---|---|---|---|
| Classic Tank Top | Top | 1 | 80 | White ribbed training tank |
| Training Shorts | Bottom | 1 | 60 | Grey shorts, accent waistband + side stripes |
| Gym Socks | Feet | 1 | 40 | White crew socks with two accent bands |
| Lifting Belt | Waist | 3 | 250 | Brown leather, steel prong buckle |
| Wrist Wraps | Wrists | 3 | 180 | White wraps with an accent tab |
| Chalk Bag | Accessory | 3 | 220 | Canvas bag on a cord, chalk dust |
| Pro Singlet | Top | 5 | 600 | Blue competition singlet, accent piping |
| Carbon Knee Sleeves | Legs | 5 | 700 | Black sleeves, accent bands top and bottom |
| Signature Hoodie | Top | 5 | 850 | Charcoal hoodie, hood, kangaroo pocket, drawstrings |
| Golden Championship Belt | Waist | 10 | 1500 | Gold strap, star medallion, side plates |
| Diamond Avatar Aura | Aura | 10 | 1800 | Pulsing blue glow with floating diamonds |
| Legacy Trophy Case | Display | 10 | 2000 | Lit cabinet with three trophies |

## Equip slots

One item per slot can be equipped at a time (`owned_items.equipped`, enforced in
`lib/economy.js`). The slots are the values of `store_items.category`:

`Top` · `Bottom` · `Feet` · `Waist` · `Wrists` · `Legs` · `Accessory` · `Aura` · `Display`

`Aura` renders behind the avatar; `Display` renders beside it (not on the body);
everything else is drawn on the body in a fixed z-order: Legs → Feet → Bottom →
Top → Waist → Wrists → Accessory → Display.

Adding a new slot means adding a renderer to `cosmetics/cosmeticRegistry.js`, a
crop to `cosmetics/ItemThumb.jsx`'s `SLOT_VIEWBOX`, and an entry in Avatar's
`SLOT_Z_ORDER`.

## Adding an item

1. **Catalog row** — insert into `store_items` (name, description, category,
   required_prestige, cost_aura, sort_order). The tiers the Store screen groups
   by are prestige 1 / 3 / 5 / 10 ("Basic Fits", "Gear", "Premium", "Exclusive").
2. **Art** — add a component to `src/components/avatar/cosmetics/itemArt.jsx` and
   register it in `ITEM_ART` under the item's **exact** name.

Step 2 is optional per item: an unrecognised name falls back to the generic
per-slot placeholder, so a catalog row added in Supabase always renders
*something*. Art can land later without touching the database.

## The one rule for new art

Anchor everything to `geo`, never to fixed pixel offsets.

Each component receives `{ metrics, geo }`. `geo` is
`getStageGeometry(level, metrics)` from `lib/avatarConfig.js` — the exact
rectangles `AvatarBody` draws at the wearer's current physique stage:

- `shoulderHalf`, `waistHalf`, `hipHalf`
- `armLeftX`, `armRightX`, `armWidth`, `armTopY`, `armBottomY`
- `legLeftX`, `legRightX`, `legWidth`, `legTopY`, `legBottomY`
- `torsoHalf(g, y)` (local helper) for the torso's half-width at any y

This matters because the body changes shape a lot across the six stages — the
shoulders span 60→90 and the waist 70→44. Art tuned to a mid-range stage
visibly detaches at stage 1 and stage 6 (this was a real bug: hoodie sleeves
hung in empty space, belts overhung the silhouette by 8–10px).

Give garments a couple of px of margin past the body so they read as fabric
over the limb rather than paint on it.

## Verifying new art

A DEV-only preview route renders the whole catalog. With `npm run dev` running:

```
node scripts/preview-shot.mjs http://localhost:5173/preview out.png 1080
```

The **"Store items at the physique extremes"** section renders every garment at
stage 1 and stage 6 side by side — check new art there, not just at mid-stage.
The **"Store thumbnails"** section exercises the no-`geo` fallback path used by
the Store screen's row thumbnails.
