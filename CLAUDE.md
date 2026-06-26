# Lifemaxx — Claude Code context

## Project
Personal fitness PWA. React + Vite + Tailwind + Supabase. Mobile-first, saves to iPhone home screen as PWA.

## Progress
- Sprint 1 complete: foundation, auth, 5 tabs, schema
- Sprint 2 complete: workouts (PPL, set logging, PR detection, cardio), account creation with invite code
- Sprint 3 complete: habits, per-habit streaks, evolving avatar with earned gear layers
- Sprint 4 complete: nutrition with USDA food search + macro calculation, photos with gallery and compare view
- Sprint 5 IN PROGRESS: calendar history view on dashboard — tap any day to see full day detail. Got cut off mid-sprint. Resume and complete this.

## What to do tonight
Work through the remaining sprints in order. After each sprint completes and is verified working, move to the next. Stop if you need user input you can't resolve from the codebase.

## Sprint 5 — finish first (IN PROGRESS)
Calendar on dashboard. Tap any day → detail view showing: workout sets logged, habits, swims/cardio, nutrition macros. Color-code days by completion (full = #5AB4FF, partial = dimmed accent, missed = neutral, rest = subtle). Already date-stamped data in DB — this is a query-by-date view.

## Sprint 6 — Prestige + Aura economy + Store
AURA earned: workout +50, each habit hit +20, swim target +40, streak day +10.
PRESTIGE: +1 level per week when workout + majority of habits hit on 5/7 days. Never decreases.
STORE tiers: Prestige 1+ basic fits, Prestige 3+ gear, Prestige 5+ premium, Prestige 10+ exclusive.
Dashboard: prestige badge near avatar, aura counter at top.
Tables needed: user_economy, store_items, owned_items (may already exist — check before creating).
Seed store_items with placeholder items across all 4 tiers.

## Sprint 7 — Runway assets (SKIP tonight)
Requires user to provide image files. Skip entirely.

## Sprint 8 — Polish + ship
Full visual overhaul to Apple-level quality. Tighten typography, refine cards, add iOS transitions and micro-animations. Progress charts with Recharts (bench/squat weight over time, daily protein 30 days). Confirm PWA manifest works. Set up Vercel deployment config (vercel.json if needed) but don't deploy — user will run final deploy command.

## Design system
Read