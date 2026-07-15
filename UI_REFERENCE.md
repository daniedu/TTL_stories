# TTL Stories — UI Reference

## Overview

Location-based ephemeral story sharing app. Stories expire after 24 hours. Users can post text at a location, view stories on a map or feed, and share story links.

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS (dark theme)
- Firebase Firestore + Auth
- Leaflet map (react-leaflet)
- Vercel deployment with OG images

## Pages / Routes

### `/` — Home (main app)

A full-height (`h-dvh`) single-page app. No scrolling — everything fits in the viewport.

**Header bar** (`h-dvh` top, `border-b border-gray-800`, `px-4 py-3`):
- Left: app title **"TTL Stories"** (bold, `text-base`, white) + subtitle showing "50km radius", "Global", "Finding location...", or story count
- Right: session mode toggle button + story count + auth panel

Session mode toggle is a small pill button:
- **Public mode** (🌍 Public, blue) — shows map + feed with public stories
- **Private mode** (🔒 Private, gray) — shows only your own stories (all visibilities) in feed, no map

**Tab bar** (`border-b border-gray-800`, `text-sm`, flex, equal 3 buttons):
- **Map** — shows Leaflet map with story markers (only in public mode)
- **Feed** — scrollable story list
- **Local / Global** — toggle between location-based radius (50km) and global feed (only in public mode)

**Map tab** (`relative flex-1`):
- Full-height Leaflet map (no default tiles — custom dark tile layer)
- Stories shown as markers at their location
- Click map → opens PostForm at that location
- Floating action button (bottom-right, `bg-blue-600`, rounded-full) — "Post at my location"

**Feed tab** (`overflow-y-auto`, `space-y-2`, `p-4`):
- List of story cards, each is a `rounded-lg border border-gray-800 bg-gray-900 p-3`
- Story card:
  - Text content (`text-sm text-white`)
  - Action buttons row (🔗 copy share link, ⚑ report, ✕ delete if owner)
  - Metadata row (`text-xs text-gray-500`): author name · timestamp · visibility badge (🌍 green / 🔗 yellow / 🔒 red)

**Empty state**: "No stories yet. Tap the map to post one."

**Error banner**: `bg-red-900/50` bar with error message text when Firestore query fails

---

### `/story/[id]` — Shareable story page (server-rendered)

Full-height, dark background (`bg-gray-950`).

**Header** (`border-b border-gray-800`):
- "TTL Stories" title on left
- Time remaining on right (e.g. "12h 34m remaining")

**Content** (centered, `max-w-md`):
- Story card in `rounded-xl border border-gray-800 bg-gray-900 p-6`
- Story text: `text-lg`, white, relaxed leading
- Footer row: author name · visibility badge
- Date/time below

**Expired state**: "Story Expired" message
**Private/access denied state**: "Private Story — You don't have access"

---

## Components

### PostForm (bottom sheet overlay)
`fixed inset-0 z-[9999]`, on mobile slides up (`items-end`), on desktop centers (`sm:items-center sm:justify-center`).

Sheet content (`rounded-t-2xl border border-gray-700 bg-gray-900 p-4 sm:max-w-md sm:rounded-2xl`):
- Location coordinates (lat, lng) top-left, close (✕) button top-right
- Textarea (`rounded-lg border border-gray-700 bg-gray-800`, 3 rows, max 280 chars)
- Visibility selector: 3 pill buttons in a row:
  - 🌍 Public (green when selected)
  - 🔗 Unlisted (yellow when selected)
  - 🔒 Private (red when selected)
- Character counter + submit button ("Post" / "Posting...")
- Footer: "Expires in 24 hours · Author name"

### AuthPanel
Sign-in form or user info. Shows email/password login/register fields, or display name + logout button.

### StoryFeed
Scrollable list of story cards (described above).

### Map
Leaflet map component. No default attribution, custom dark tile style. Click handler opens PostForm.

---

## Color Palette (Tailwind)

| Token | Hex | Usage |
|-------|-----|-------|
| `gray-950` | `#030712` | Page background |
| `gray-900` | `#111827` | Card background |
| `gray-800` | `#1f2937` | Borders, dividers |
| `gray-700` | `#374151` | Input borders |
| `blue-600` | `#2563eb` | Primary actions, active state |
| `green-600` | `#16a34a` | Public visibility badge |
| `yellow-600` | `#ca8a04` | Unlisted visibility badge |
| `red-600` | `#dc2626` | Private visibility badge |
| `white` | `#fff` | Primary text |
| `gray-400` | `#9ca3af` | Secondary text |
| `gray-500` | `#6b7280` | Muted text, inactive buttons |
| `red-900/50` | `#7f1d1d/50` | Error banner background |

---

## Typography

- Headings: `text-base font-bold` (14px bold)
- Story text: `text-lg` (18px) / `text-sm` (14px)
- Metadata: `text-xs` (12px), `text-gray-500`
- Characters: max 280 per story

---

## OG Images (auto-generated via `@vercel/og`)

Each story gets a dynamic 1200×630 OG image:
- Dark gradient background (`#030712 → #111827`)
- Blue "TTL Stories" header with clock icon
- Story text (white, 42px, up to 4 lines)
- Author name · time remaining · visibility badge in gray footer

Home page fallback: globe emoji + "TTL Stories" title + tagline + feature badges.

---

## Data Model

```
Story {
  id: string
  content: string (max 280 chars)
  location: GeoPoint
  geohash: string
  timezone: string
  createdAt: Timestamp
  expiresAt: Timestamp (created + 24h)
  authorId: string
  authorName: string | null
  visibility: "public" | "unlisted" | "private"
  reports?: number
  sharedWith?: string[]
}
```

## Visbility Modes

| Mode | Shows on map/feed | Shareable via link | Access |
|------|-------------------|--------------------|--------|
| Public | ✅ | ✅ (anyone) | Anyone |
| Unlisted | ❌ | ✅ (anyone with link) | Anyone with link |
| Private | ❌ | ✅ (author only) | Author only (by UID) |

## Session Modes (top-right toggle)

| Mode | Shows |
|------|-------|
| Public browsing | Public stories on map + feed (location-based or global) |
| Private browsing | All your own stories (any visibility) in feed only |

## Sharing

Each story card in the feed has a 🔗 button that copies `https://domain/story/{id}` to clipboard. Shared links render the dedicated story page with OG image preview on Twitter/Discord/Slack.
