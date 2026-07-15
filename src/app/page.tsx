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
      <header className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <div>
          <h1 className="text-base font-bold">TTL Stories</h1>
          {authLoading ? (
            <p className="text-xs text-gray-500">Connecting...</p>
          ) : !userPosition && mode === "local" ? (
            <p className="text-xs text-yellow-500">Finding location...</p>
          ) : (
            <p className="text-xs text-gray-500">
              {mode === "local" ? `${RADIUS_LOCAL}km radius` : "Global"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSessionMode(sessionMode === "public" ? "private" : "public")}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
              sessionMode === "public"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400"
            }`}
            title={sessionMode === "public" ? "Switch to private mode" : "Switch to public mode"}
          >
            {sessionMode === "public" ? "🌍 Public" : "🔒 Private"}
          </button>
          <span className="text-xs text-gray-500">
            {storiesLoading ? "..." : stories.length}
          </span>
          <AuthPanel />
        </div>
      </header>

      <div className="flex border-b border-gray-800 text-sm">
        {sessionMode === "public" && (
          <button
            onClick={() => setTab("map")}
            className={`flex-1 py-2 text-center ${
              tab === "map"
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-500"
            }`}
          >
            Map
          </button>
        )}
        <button
          onClick={() => setTab("feed")}
          className={`flex-1 py-2 text-center ${
            tab === "feed" || sessionMode === "private"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-500"
          }`}
        >
          Feed
        </button>
        {sessionMode === "public" && (
          <button
            onClick={() => setMode(mode === "local" ? "global" : "local")}
            className={`flex-1 py-2 text-center ${
              mode === "local" ? "text-blue-400" : "text-gray-500"
            }`}
          >
            {mode === "local" ? "Local" : "Global"}
          </button>
        )}
      </div>

      {storiesError && (
        <div className="bg-red-900/50 px-4 py-2 text-xs text-red-300">
          {storiesError}
        </div>
      )}

      <section className="relative flex-1">
        {tab === "map" && sessionMode === "public" ? (
          <>
            <Map
              stories={stories}
              selectedPosition={selectedPosition}
              userPosition={userPosition}
              onMapClick={(latlng) => setSelectedPosition(latlng)}
            />
            <button
              onClick={() => {
                if (userPosition) setSelectedPosition(userPosition);
              }}
              className="absolute bottom-4 right-4 z-[1000] rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700"
              title="Post at my location"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
