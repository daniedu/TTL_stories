# Setup

## 1. Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project
2. Register a **Web app** (gear icon → Project settings → Add app → Web)
3. Copy the config values into `.env` (or `.env.local`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 2. Firestore Database

1. **Create database** → choose your region → start in **test mode**
2. Create a **composite index** for geo-queries:
   - Go to **Firestore → Indexes → Add**
   - Collection: `stories`
   - Fields:
     - `geohash` Ascending
     - `expiresAt` Ascending
     - `createdAt` Descending
3. (Optional) Set a **TTL policy** so expired docs auto-delete:
   - Firestore → Advanced → `stories` collection → **Enable TTL**
   - Field: `expiresAt`

## 3. Authentication

1. Go to **Authentication → Sign-in method**
2. Enable **Anonymous** (toggle on)
3. Enable **Email/Password** (toggle on)

## 4. Firestore Security Rules

Go to **Firestore → Rules** and paste:

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

## 5. Run

```bash
pnpm dev
```
