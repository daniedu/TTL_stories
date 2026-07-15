# TTL Stories

Ephemeral location-based stories that expire after 24 hours.

## Quick Start

### 1. Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Register a **Web app** (Project Settings → Add app → Web)
3. Copy the config values into `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 2. Firestore Database

- **Create database** → choose region → **test mode** (lock down with rules later)
- **Deploy composite indexes** (required for queries):

```bash
npx firebase-tools deploy --only firestore:indexes
```

Or manually create in the Firebase Console:
- Collection: `stories`
- Fields:
  - `expiresAt` Ascending
  - `createdAt` Descending

- (Optional) Set **TTL policy**: Firestore → Advanced → `stories` → Enable TTL on `expiresAt`

### 3. Authentication

Enable **Anonymous** and **Email/Password** in Authentication → Sign-in method.

### 4. Security Rules

Paste into Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /stories/{storyId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.content is string
        && request.resource.data.content.size() <= 280
        && request.resource.data.location is latlng
        && request.resource.data.expiresAt > request.time;
      allow update: if request.auth != null
        && request.resource.data.diff(resource.data).changedKeys.size() == 1
        && request.resource.data.diff(resource.data).changedKeys.hasOnly(['reports'])
        && request.resource.data.reports == resource.data.reports + 1;
      allow delete: if request.auth != null
        && resource.data.authorId == request.auth.uid;
    }
  }
}
```

### 5. Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Features

- Post stories pinned to a location on the map
- Stories auto-delete after 24 hours via Firestore TTL
- Local mode (50 km radius) or global mode
- Anonymous usage with optional email account upgrade
- Report inappropriate stories
- Install as PWA on mobile
