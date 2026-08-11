# Lifemaxx — Claude Code context

## Project
Personal fitness PWA. React + Vite + Tailwind + Supabase. Mobile-first, saves to iPhone home screen as PWA.

## Progress
- Sprint 1 complete: foundation, auth, 5 tabs, schema
- Sprint 2 complete: workouts (PPL, set logging, PR detection, cardio), account creation with invite code
- Sprint 3 complete: habits, per-habit streaks, evolving avatar with earned gear layers
- Sprint 4 complete: nutrition with USDA food search + macro calculation, photos with gallery and compare view
- Sprint 5 complete: calendar history — 7-day strip on Dashboard expands to a full month view, tap any day for workout/habits/cardio/nutrition detail, color-coded by completion.
- Sprint 6 complete: Aura + Prestige economy and Store. Aura accrues daily/weekly from workouts, habits, swim target, and streak days; Prestige levels up weekly off 5/7 majority-habit days and never decreases. Store (linked from Dashboard, not a tab) sells placeholder cosmetics across 4 prestige-gated tiers, purchasable with aura.
- Sprint 7 skipped per instructions (needs user-provided image assets).
- Sprint 8 complete: Recharts progress charts (bench/squat weight trend on Workouts, 30-day protein bars on Nutrition), fade-in motion on banners and expanding cards, global focus-visible styling, PWA manifest verified (scope added, builds sw.js/workbox cleanly), vercel.json added for SPA rewrites (no deploy run).
- Equipped cosmetics complete: store_items.category is now a real equip slot (Top/Bottom/Feet/Waist/Wrists/Legs/Accessory/Aura/Display) instead of a duplicate tier label; owned_items.equipped lets one item per slot be equipped, enforced in lib/economy.js's equipItem(). Avatar renders equipped items as placeholder cosmetic layers (src/components/avatar/cosmetics/), keyed by category in a registry so Sprint 7 can swap each placeholder for a real `<image>` without touching the lookup. Store screen shows Equip/Unequip in place of Buy for owned items, with a slot tag per item.
- Design polish pass complete: shared `.card-shadow` utility (replaced ~17 duplicated inline box-shadow styles app-wide) with a subtle inset highlight; `.pop-in` spring animation on completions (set logged, habit target hit, aura gained, level-up, store purchase/equip); tab bar got an active-tab pill + icon scale + separation shadow; avatar card got a prestige badge and tighter padding.
- QA pass complete: fixed a real bug in lib/avatar.js where syncAvatarProgress's backfill never advanced last_evaluated_date, so calling it more than once before today's criteria was met (e.g. Habits → Dashboard → Workouts in one session) silently re-applied the same past day's level/streak change every time. Verified Workouts multi-set logging, USDA food search (live API), Calendar day-detail + month modal nav, and Store purchase/equip all work correctly against real data and against a fresh zero-data user with no console errors anywhere. Dashboard gained a live clock, a lightning-bolt aura counter with a persistent "+N today" indicator, and a "Prestige N → N+1: x/5 days this week" progress bar fed by economy.js's syncEconomy (now also returns live week progress).

- Sprint 10 complete (avatar system): avatar_customization table (sprint10_migration.sql — **operator must run it in the Supabase SQL Editor**; until then the app renders default appearance and skips the setup gate). First login now forces a "Create your avatar" screen — skin tone (8), hair style (6) + color (8), facial hair (4) — with live preview and a 6-stage evolution strip; editable later via the pencil on the Dashboard avatar card (/avatar). AvatarBody renders skin/face/hair/default shorts with stage-scaled muscle definition; earned gear + store cosmetics still align through the shared METRICS contract. Sprint 7's missing store art is now covered with per-item vector art for all 12 seeded items (cosmetics/itemArt.jsx, keyed by store_items.name, slot-placeholder fallback for future rows) plus item thumbnails in Store rows and a fixed cosmetic z-order. DEV-only /preview and /preview/setup routes render the full visual matrix without auth for QA.

## Remaining to ship
- Operator: run supabase/sprint10_migration.sql, then deploy (Vercel) whenever ready.
- Store catalog growth: add rows to store_items in Supabase, then matching art in
  src/components/avatar/cosmetics/itemArt.jsx keyed by the item's exact name (unknown
  names fall back to the generic slot placeholder, so partial rollouts are safe).

## Design system
Read