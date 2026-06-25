# Lifemaxx Design System

## Project
Personal fitness PWA called Lifemaxx. Dark, premium, Apple-level polish. Think Apple meets a serious training app. Every screen should feel like it belongs on an iPhone — clean, smooth, intentional.

## Colors
Background: #0d0d12 (blue-black, not pure black)
Accent primary: #5AB4FF (between baby blue and electric blue)
Accent hover: #78C6FF
Surface cards: #16161e
Border: rgba(255,255,255,0.07)
Muted text: #6e7a8a
Body text: #e8eaf0
Success/completion: #34d399

## Typography
Font: Inter (closest web equivalent to SF Pro)
Display/headers: Inter 600-700, letter-spacing -0.02em
Body: Inter 400, line-height 1.6
Numbers/stats/weights: Fira Code or JetBrains Mono — gives a precise data feel
Scale: 11px labels → 13px body → 15px subheads → 20px section heads → 28px+ hero text

## Cards and surfaces
Border radius: 16px for cards, 10px for buttons, 6px for tags/pills
Card style: #16161e background, 1px border rgba(255,255,255,0.07), no harsh outlines
Padding: 20px minimum inside every card
Shadows: subtle, dark — box-shadow: 0 4px 24px rgba(0,0,0,0.4)

## Motion
Subtle and smooth, exactly like iOS.
Transitions: 200-300ms ease-out
Level-ups and completions: gentle spring animation
Tab switches: smooth fade or slide
Nothing bouncy, nothing dramatic, nothing that slows the app down

## Layout
Bottom tab navigation with 5 tabs: Dashboard, Workouts, Habits, Nutrition, Photos
Safe area padding for iPhone notch and home indicator
One clear focal point per screen
Cards group related information
Progressive disclosure — tap to expand detail, don't show everything at once
Balanced information density — never overwhelming, never too sparse

## Components
Inputs: dark background, accent border on focus, monospace font for numbers
Buttons: primary uses accent blue, full width for main actions, rounded 10px
Progress rings: thin stroke, accent blue fill, dark track
Checkmarks/completions: smooth draw animation, accent blue
Avatar: centered, large, prominent on dashboard

## What to avoid
Pure black (#000000) backgrounds
Lime or neon green accents
Gradient backgrounds
Harsh white borders (1px solid white)
Dense walls of text or data
Generic loading spinners
Anything that looks like a default Tailwind component
Rounded corners so large it looks like a children's app