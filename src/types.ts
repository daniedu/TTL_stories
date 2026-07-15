import type { Timestamp, GeoPoint } from "firebase/firestore";

export type Visibility = "public" | "unlisted" | "private";

export interface Story {
  id: string;
  content: string;
  location: GeoPoint;
  geohash: string;
  timezone: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  authorId: string;
  authorName: string | null;
  visibility: Visibility;
  imageUrl?: string;
  reports?: number;
  sharedWith?: string[];
}
