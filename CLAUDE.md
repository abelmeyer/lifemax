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

## What to do tonight
Work through the remaining sprints in order. After each sprint completes and is verified working, move to the next. Stop if you need user input you can't resolve from the codebase.

## Sprint 7 — Runway assets (SKIP tonight)
Requires user to provide image files. Skip entirely.

## Sprint 8 — Polish + ship
Full visual overhaul to Apple-level quality. Tighten typography, refine cards, add iOS transitions and micro-animations. Progress charts with Recharts (bench/squat weight over time, daily protein 30 days). Confirm PWA manifest works. Set up Vercel deployment config (vercel.json if needed) but don't deploy — user will run final deploy command.

## Design system
Read