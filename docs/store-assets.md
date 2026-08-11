# Store assets — what exists, and how to add more

## The catalog

43 items across ten equip slots and four prestige tiers. The authoritative list
is the seed data in the migrations, not this file:

- `supabase/sprint6_migration.sql` — the original 12
- `supabase/sprint12_migration.sql` — 31 more, plus the `Head` slot

To see them rendered rather than listed, run the dev server and screenshot the
catalog:

```
node scripts/store-catalog.mjs http://localhost:5173 catalog.png
```

## Equip slots

One item per slot can be equipped at a time (`owned_items.equipped`, enforced in
`lib/economy.js`). The slots are the values of `store_items.category`:

`Head` · `Top` · `Bottom` · `Feet` · `Waist` · `Wrists` · `Legs` · `Accessory` · `Aura` · `Display`

`Aura` renders behind the avatar; `Display` renders beside it (not on the body);
everything else is drawn on the body in a fixed z-order: Legs → Feet → Bottom →
Top → Waist → Wrists → Accessory → Head → Display.

Adding a new slot means adding a renderer to `cosmetics/cosmeticRegistry.js`, a
crop to `cosmetics/ItemThumb.jsx`'s `SLOT_VIEWBOX`, and an entry in Avatar's
`SLOT_Z_ORDER`.

## Adding an item

1. **Catalog row** — insert into `store_items` (name, description, category,
   required_prestige, cost_aura, sort_order). The tiers the Store screen groups
   by are prestige 1 / 3 / 5 / 10 ("Basic Fits", "Gear", "Premium", "Exclusive").
2. **Art** — add a component to `src/components/avatar/cosmetics/art/<slot>.jsx`
   and register it in `ITEM_ART` (in `itemArt.jsx`) under the item's **exact**
   name.

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
- `torsoHalf(g, y)` and `headCenter(metrics)` from `art/shared.js`

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
