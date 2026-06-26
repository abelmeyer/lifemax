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

## What to do tonight
Work through the remaining sprints in order. After each sprint completes and is verified working, move to the next. Stop if you need user input you can't resolve from the codebase.

## Sprint 7 — Runway assets (SKIP tonight)
Requires user to provide image files. Skip entirely.

## Sprint 8 — Polish + ship
Full visual overhaul to Apple-level quality. Tighten typography, refine cards, add iOS transitions and micro-animations. Progress charts with Recharts (bench/squat weight over time, daily protein 30 days). Confirm PWA manifest works. Set up Vercel deployment config (vercel.json if needed) but don't deploy — user will run final deploy command.

## Design system
Read