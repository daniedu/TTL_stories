"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { geohashQueryBounds } from "@/lib/geo";
import { useAuth } from "@/lib/auth";
import { generateMockStories, filterMockStories } from "@/lib/mockData";
import type { Story } from "@/types";

const IS_MOCK = typeof window !== "undefined" && (
  new URLSearchParams(window.location.search).has("mock") ||
  (window as any).__MOCK_MODE__
);

export function useStories(
  center: [number, number] | null,
  radiusKm: number,
  sessionMode: "public" | "private" = "public",
) {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clat = center?.[0];
  const clng = center?.[1];
  const hasCenter = clat !== undefined && clng !== undefined;

  useEffect(() => {
    if (IS_MOCK) {
      const c = hasCenter ? [clat!, clng!] as [number, number] : null;
      const all = generateMockStories(c, radiusKm);
      const filtered = filterMockStories(all, c, radiusKm);
      setStories(filtered as unknown as Story[]);
      setLoading(false);
      return;
    }

    const db = getDb();
    setLoading(true);
    setError(null);

    try {
      if (sessionMode === "private") {
        if (!user?.uid) {
          setStories([]);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "stories"),
          where("authorId", "==", user.uid),
          where("expiresAt", ">", Timestamp.now()),
          orderBy("createdAt", "desc"),
        );

        const unsub = onSnapshot(
          q,
          (snapshot) => {
            const list: Story[] = [];
            snapshot.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() } as Story);
            });
            setStories(list);
            setLoading(false);
          },
          (err) => {
            setError(err.message);
            setLoading(false);
          },
        );

        return unsub;
      }

      if (hasCenter) {
        const prefixes = geohashQueryBounds(clat, clng, radiusKm);
        const q = query(
          collection(db, "stories"),
          where("geohash", ">=", prefixes[0]),
          where("geohash", "<=", prefixes[prefixes.length - 1]),
        );

        const unsub = onSnapshot(
          q,
          (snapshot) => {
            const list: Story[] = [];
            snapshot.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() } as Story);
            });

            const now = Timestamp.now();
            const filtered = list.filter((s) => {
              if (s.expiresAt && s.expiresAt.toMillis() <= now.toMillis()) return false;
              if (s.visibility !== "public") return false;
              const dist = haversineDistance(clat, clng, s.location.latitude, s.location.longitude);
              return dist <= radiusKm;
            });

            filtered.sort((a, b) => {
              const ta = a.createdAt?.toMillis() ?? 0;
              const tb = b.createdAt?.toMillis() ?? 0;
              return tb - ta;
            });

            setStories(filtered);
            setLoading(false);
          },
          (err) => {
            setError(err.message);
            setLoading(false);
          },
        );

        return unsub;
      } else {
        const q = query(
          collection(db, "stories"),
          where("expiresAt", ">", Timestamp.now()),
          where("visibility", "==", "public"),
          orderBy("createdAt", "desc"),
        );

        const unsub = onSnapshot(
          q,
          (snapshot) => {
            const list: Story[] = [];
            snapshot.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() } as Story);
            });
            setStories(list);
            setLoading(false);
          },
          (err) => {
            setError(err.message);
            setLoading(false);
          },
        );

        return unsub;
      }
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
    }
  }, [clat, clng, radiusKm, hasCenter, sessionMode, user?.uid]);

  return { stories, loading, error };
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
