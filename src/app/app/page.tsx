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

function AppInner() {
  const { user, loading: authLoading } = useAuth();
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [mode, setMode] = useState<"local" | "global">("local");
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [tab, setTab] = useState<"map" | "feed">("map");
  const [sessionMode, setSessionMode] = useState<"public" | "private">("public");
  const [showCompose, setShowCompose] = useState(false);

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

  const handleMapClick = (latlng: [number, number]) => {
    setSelectedPosition(latlng);
    setShowCompose(true);
  };

  const handleFabClick = () => {
    if (userPosition) {
      setSelectedPosition(userPosition);
      setShowCompose(true);
    }
  };

  return (
    <div className="h-dvh flex flex-col bg-background text-ink-black font-body-md overflow-hidden">
      <header className="bg-background border-b-2 border-ink-black flex items-center justify-between px-margin-mobile md:px-8 h-16 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-ink-black text-2xl hover:bg-surface-container-highest p-2 transition-colors cursor-pointer hidden md:block">
            menu
          </span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-ink-black uppercase tracking-tighter">
            TTL STORIES
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-1 h-full">
          <button
            onClick={() => setTab("map")}
            className={`flex items-center justify-center px-6 h-12 font-label-caps text-label-caps border-2 border-ink-black transition-all active:scale-95 ${
              tab === "map"
                ? "bg-airmail-blue text-on-primary"
                : "bg-transparent text-ink-black hover:bg-surface-dim"
            }`}
          >
            MAP
          </button>
          <button
            onClick={() => setTab("feed")}
            className={`flex items-center justify-center px-6 h-12 font-label-caps text-label-caps border-2 border-ink-black transition-all active:scale-95 -ml-[2px] ${
              tab === "feed"
                ? "bg-airmail-blue text-on-primary"
                : "bg-transparent text-ink-black hover:bg-surface-dim"
            }`}
          >
            FEED
          </button>
          <button
            onClick={() => setMode(mode === "local" ? "global" : "local")}
            className={`flex items-center justify-center px-6 h-12 font-label-caps text-label-caps border-2 border-ink-black transition-all active:scale-95 -ml-[2px] ${
              mode === "local"
                ? "bg-airmail-blue text-on-primary"
                : "bg-transparent text-ink-black hover:bg-surface-dim"
            }`}
          >
            {mode === "local" ? "LOCAL" : "GLOBAL"}
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSessionMode(sessionMode === "public" ? "private" : "public")}
            className={`hidden md:flex items-center gap-2 px-3 py-1 border-2 border-ink-black font-label-caps text-label-caps font-bold active:translate-y-0.5 transition-transform ${
              sessionMode === "public"
                ? "bg-airmail-blue text-on-primary"
                : "bg-paper-cream text-ink-black"
            }`}
          >
            {sessionMode === "public" ? "PUBLIC" : "PRIVATE"}
          </button>
          <span className="font-metadata text-metadata text-ink-black/60">
            {storiesLoading ? "..." : stories.length}
          </span>
          <AuthPanel />
        </div>
      </header>

      <div className="md:hidden flex border-b-2 border-ink-black bg-surface-container-low">
        {sessionMode === "public" && (
          <button
            onClick={() => setTab("map")}
            className={`tab-active flex-1 py-2.5 font-label-caps text-label-caps text-center transition-all ${
              tab === "map" ? "" : "bg-surface-dim/40 text-ink-black border-b-2 border-ink-black"
            }`}
          >
            MAP
          </button>
        )}
        <button
          onClick={() => setTab("feed")}
          className={`tab-active flex-1 py-2.5 font-label-caps text-label-caps text-center transition-all ${
            tab === "feed" || sessionMode === "private" ? "" : "bg-surface-dim/40 text-ink-black border-b-2 border-ink-black"
          }`}
        >
          FEED
        </button>
        {sessionMode === "public" && (
          <button
            onClick={() => setMode(mode === "local" ? "global" : "local")}
            className={`tab-active flex-1 py-2.5 font-label-caps text-label-caps text-center transition-all ${
              mode === "local" ? "" : "bg-surface-dim/40 text-ink-black border-b-2 border-ink-black"
            }`}
          >
            {mode === "local" ? "LOCAL" : "GLOBAL"}
          </button>
        )}
      </div>

      {storiesError && (
        <div className="bg-stamp-red text-on-primary px-4 py-2 font-metadata text-metadata text-center">
          {storiesError}
        </div>
      )}

      <main className="flex-1 flex overflow-hidden">
        <aside className="hidden md:flex w-96 shrink-0 border-r-2 border-ink-black bg-paper-cream overflow-y-auto custom-scrollbar flex-col">
          <div className="p-4 border-b-2 border-ink-black flex justify-between items-center bg-surface-container shrink-0">
            <span className="font-label-caps text-label-caps">RECENT DISPATCHES</span>
            <span className="font-metadata text-metadata bg-ink-black text-white px-2 py-0.5">{stories.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <StoryFeed stories={stories} userId={user?.uid ?? null} compact />
          </div>
          <div className="p-4 bg-ink-black text-white text-center shrink-0">
            <button className="font-label-caps text-label-caps tracking-widest hover:text-airmail-blue transition-colors">
              VIEW ALL ARCHIVES
            </button>
          </div>
        </aside>

        <section className="flex-1 relative bg-surface-dim/40 paper-texture">
          {tab === "map" && sessionMode === "public" ? (
            <Map
              stories={stories}
              selectedPosition={selectedPosition}
              userPosition={userPosition}
              onMapClick={handleMapClick}
            />
          ) : (
            <div className="md:hidden h-full overflow-y-auto custom-scrollbar">
              <StoryFeed stories={stories} userId={user?.uid ?? null} />
            </div>
          )}

          <div className="md:hidden fixed bottom-24 right-6 z-50">
            <button onClick={handleFabClick} className="wax-seal" title="Compose new dispatch">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center h-20 px-2 bg-paper-cream border-t-2 border-ink-black">
        <button
          onClick={() => setTab("map")}
          className={`flex flex-col items-center justify-center p-2 mx-1 transition-all active:scale-95 ${
            tab === "map"
              ? "bg-airmail-blue text-on-primary border-2 border-ink-black"
              : "text-ink-black hover:bg-surface-dim"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
          <span className="font-label-caps text-[10px] mt-1">MAP</span>
        </button>
        <button
          onClick={() => setTab("feed")}
          className={`flex flex-col items-center justify-center p-2 mx-1 transition-all active:scale-95 ${
            tab === "feed"
              ? "bg-airmail-blue text-on-primary border-2 border-ink-black"
              : "text-ink-black hover:bg-surface-dim"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="font-label-caps text-[10px] mt-1">FEED</span>
        </button>
        <button
          onClick={() => setMode(mode === "local" ? "global" : "local")}
          className={`flex flex-col items-center justify-center p-2 mx-1 transition-all active:scale-95 ${
            mode === "global"
              ? "bg-airmail-blue text-on-primary border-2 border-ink-black"
              : "text-ink-black hover:bg-surface-dim"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <span className="font-label-caps text-[10px] mt-1">GLOBAL</span>
        </button>
      </nav>

      {showCompose && selectedPosition && (
        <PostForm
          position={selectedPosition}
          onClose={() => {
            setShowCompose(false);
            setSelectedPosition(null);
          }}
        />
      )}
    </div>
  );
}

export default function AppPage() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
