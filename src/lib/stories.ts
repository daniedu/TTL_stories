import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  GeoPoint,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { getDb } from "./firebase";
import { encodeGeohash } from "./geo";
import type { Visibility, Story } from "@/types";

const TTL_HOURS = 24;

function isMock() {
  return typeof window !== "undefined" && (
    new URLSearchParams(window.location.search).has("mock") ||
    (window as any).__MOCK_MODE__
  );
}

export async function createStory(
  content: string,
  lat: number,
  lng: number,
  timezone: string,
  authorId: string,
  authorName: string | null,
  visibility: Visibility = "public",
) {
  if (isMock()) return;
  const db = getDb();
  const now = Timestamp.now();
  const expiresAt = new Timestamp(
    now.seconds + TTL_HOURS * 60 * 60,
    now.nanoseconds,
  );

  await addDoc(collection(db, "stories"), {
    content,
    location: new GeoPoint(lat, lng),
    geohash: encodeGeohash(lat, lng),
    timezone,
    createdAt: serverTimestamp(),
    expiresAt,
    authorId,
    authorName,
    visibility,
  });
}

export async function getStory(id: string): Promise<Story | null> {
  if (isMock()) return null;
  const db = getDb();
  const snap = await getDoc(doc(db, "stories", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Story;
}

export async function deleteStory(id: string) {
  if (isMock()) return;
  const db = getDb();
  await deleteDoc(doc(db, "stories", id));
}

export async function reportStory(id: string) {
  if (isMock()) return;
  const db = getDb();
  const { increment, updateDoc } = await import("firebase/firestore");
  await updateDoc(doc(db, "stories", id), {
    reports: increment(1),
  });
}
