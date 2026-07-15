"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useStories } from "@/hooks/useStories";

const IS_MOCK = typeof window !== "undefined" && (
  new URLSearchParams(window.location.search).has("mock") ||
  (window as any).__MOCK_MODE__
);
import PostForm from "@/components/PostForm";
import StoryFeed from "@/components/StoryFeed";
import AuthPanel from "@/components/AuthPanel";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const RADIUS_LOCAL = 50;
const RADIUS_GLOBAL = 20000;

function HomeInner() {
  const { user, loading: authLoading } = useAuth();
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [mode, setMode] = useState<"local" | "global">("local");
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [tab, setTab] = useState<"map" | "feed">("map");
  const [sessionMode, setSessionMode] = useState<"public" | "private">("public");

  const center = sessionMode === "public" && mode === "local" ? userPosition : null;
  const radius = mode === "local" ? RADIUS_LOCAL : RADIUS_GLOBAL;
  const { stories, loading: storiesLoading, error: storiesError } = useStories(center, radius, sessionMode);

  useEffect(() => {
    if (IS_MOCK) {
      setUserPosition([37.7749, -122.4194]);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setMode("global"),
    );
  }, []);

  return (
    <main className="flex h-dvh flex-col">
      <header className="bg-background flex items-center justify-between border-b-2 border-ink-black px-margin-mobile py-3">
        <div className="flex items-center gap-3">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-ink-black uppercase tracking-tighter">TTL STORIES</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSessionMode(sessionMode === "public" ? "private" : "public")}
            className={`border-2 border-ink-black px-3 py-1 font-label-caps text-label-caps font-bold active:translate-y-0.5 transition-transform ${
              sessionMode === "public"
                ? "bg-airmail-blue text-on-primary"
                : "bg-paper-cream text-ink-black"
            }`}
            title={sessionMode === "public" ? "Switch to private mode" : "Switch to public mode"}
          >
            {sessionMode === "public" ? "PUBLIC" : "PRIVATE"}
          </button>
          <span className="font-metadata text-ink-black opacity-60">
            {storiesLoading ? "..." : stories.length}
          </span>
          <AuthPanel />
        </div>
      </header>

      <div className="flex border-b-2 border-ink-black bg-surface-container-low">
        {sessionMode === "public" && (
          <button
            onClick={() => setTab("map")}
            className={`tab-active flex-1 py-2 font-label-caps text-center ${
              tab === "map" ? "" : "bg-surface-dim/40 text-ink-black border-b-2 border-ink-black"
            }`}
          >
            MAP
          </button>
        )}
        <button
          onClick={() => setTab("feed")}
          className={`tab-active flex-1 py-2 font-label-caps text-center ${
            tab === "feed" || sessionMode === "private" ? "" : "bg-surface-dim/40 text-ink-black border-b-2 border-ink-black"
          }`}
        >
          FEED
        </button>
        {sessionMode === "public" && (
          <button
            onClick={() => setMode(mode === "local" ? "global" : "local")}
            className={`tab-active flex-1 py-2 font-label-caps text-center ${
              mode === "local" ? "" : "bg-surface-dim/40 text-ink-black border-b-2 border-ink-black"
            }`}
          >
            {mode === "local" ? "LOCAL" : "GLOBAL"}
          </button>
        )}
      </div>

      {storiesError && (
        <div className="bg-stamp-red text-on-primary px-4 py-2 font-metadata text-center">
          {storiesError}
        </div>
      )}

      <section className="relative flex-1 paper-texture">
        {tab === "map" && sessionMode === "public" ? (
          <>
            <Map
              stories={stories}
              selectedPosition={selectedPosition}
              userPosition={userPosition}
              onMapClick={(latlng) => setSelectedPosition(latlng)}
            />
            <div className="fixed bottom-24 right-6 z-50">
              <button
                onClick={() => {
                  if (userPosition) setSelectedPosition(userPosition);
                }}
                className="wax-seal"
                title="Post at my location"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <StoryFeed stories={stories} userId={user?.uid ?? null} />
        )}
      </section>

      {selectedPosition && (
        <PostForm
          position={selectedPosition}
          onClose={() => setSelectedPosition(null)}
        />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeInner />
    </AuthProvider>
  );
}
