"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useStories } from "@/hooks/useStories";
import { useRouter } from "next/navigation";

function ProfileInner() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"local" | "global">("local");
  const [sessionMode, setSessionMode] = useState<"public" | "private">("private");
  const { stories, loading: storiesLoading } = useStories(null, 20000, "private");

  const displayName = user?.displayName || "Anonymous";
  const dispatchCount = stories.length;
  const expiredCount = stories.filter((s) => s.expiresAt.seconds * 1000 <= Date.now()).length;
  const activeCount = dispatchCount - expiredCount;

  if (authLoading) return null;

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <header className="bg-background border-b-2 border-ink-black flex items-center justify-between px-margin-mobile md:px-8 h-16 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/app"
            className="material-symbols-outlined text-ink-black text-2xl hover:bg-surface-container-highest p-2 transition-colors"
          >
            arrow_back
          </Link>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-ink-black uppercase tracking-tighter">
            TTL STORIES
          </h1>
        </div>
        <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-ink-black uppercase tracking-tighter hidden md:block">
          LEDGER
        </span>
        <div className="w-10 h-10 border-2 border-ink-black bg-white overflow-hidden">
          <div className="w-full h-full bg-surface-dim flex items-center justify-center font-headline-md text-ink-black text-sm">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
          <section className="mb-8 border-4 border-ink-black bg-paper-cream p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(26,26,27,1)] relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative shrink-0">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-dashed border-ink-black p-1 flex items-center justify-center -rotate-3 bg-white">
                  <div className="w-full h-full rounded-full border-2 border-ink-black overflow-hidden bg-surface-dim flex items-center justify-center font-headline-lg text-3xl text-ink-black">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-stamp-red text-white px-3 py-1 font-label-caps text-[10px] border-2 border-ink-black -rotate-3">
                  ACTIVE
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="mb-4">
                  <span className="font-label-caps text-[10px] text-postmark-gray uppercase tracking-widest">
                    Personal Journal &amp; Ledger
                  </span>
                  <h2 className="font-headline-lg md:text-3xl text-ink-black mt-1 uppercase tracking-tighter">
                    {displayName}
                  </h2>
                  <p className="font-metadata text-metadata italic text-ink-black/60">
                    Station Master since the Great Fog of &apos;24
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 py-4 border-y-2 border-ink-black border-dashed">
                  <div className="text-center">
                    <span className="block font-headline-md text-headline-md text-ink-black">{dispatchCount}</span>
                    <span className="font-label-caps text-[10px] text-postmark-gray uppercase">Dispatches</span>
                  </div>
                  <div className="text-center border-x border-ink-black/20">
                    <span className="block font-headline-md text-headline-md text-ink-black">{activeCount}</span>
                    <span className="font-label-caps text-[10px] text-postmark-gray uppercase">Active</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-headline-md text-headline-md text-stamp-red">{expiredCount}</span>
                    <span className="font-label-caps text-[10px] text-postmark-gray uppercase">Expired</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-headline-md text-headline-md uppercase border-b-2 border-ink-black inline-block">
                Timeline of Entries
              </h3>
            </div>

            {storiesLoading ? (
              <div className="text-center py-12 font-body-md text-postmark-gray">Loading ledger...</div>
            ) : stories.length === 0 ? (
              <div className="text-center py-12 font-body-md text-postmark-gray">
                No entries yet. Post a story to start your ledger.
              </div>
            ) : (
              <div className="space-y-6 relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-ink-black/10 z-0" />
                {stories.map((story) => {
                  const expired = story.expiresAt.seconds * 1000 <= Date.now();
                  return (
                    <div key={story.id} className="relative ml-12">
                      <div className="absolute -left-8 top-6 w-4 h-4 rounded-full bg-ink-black border-2 border-background z-10" />
                      <div className={`border-2 border-ink-black shadow-[4px_4px_0px_0px_rgba(26,26,27,1)] p-4 relative ${expired ? "opacity-70 grayscale" : "bg-paper-cream"} ${expired ? "bg-surface-container" : "bg-paper-cream"}`}>
                        {expired && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none">
                            <span className="text-6xl font-bold border-8 border-ink-black p-4 rotate-12 font-headline-lg">
                              POSTED
                            </span>
                          </div>
                        )}
                        <div className="absolute top-0 right-0 w-10 h-10 border-l-2 border-b-2 border-ink-black flex items-center justify-center bg-white">
                          <span className={`font-label-caps text-[9px] ${story.visibility === "public" ? "text-airmail-blue" : story.visibility === "unlisted" ? "text-postmark-gray" : "text-stamp-red"}`}>
                            {story.visibility === "public" ? "PUB" : story.visibility === "unlisted" ? "UNL" : "PRV"}
                          </span>
                        </div>
                        <div className="flex justify-between items-start mb-2 pr-12">
                          <span className="font-label-caps text-[10px] text-ink-black bg-airmail-blue/10 px-2 border border-ink-black">
                            REF NO: {story.id.slice(-4).toUpperCase()}
                          </span>
                          <span className="font-metadata text-[10px] text-ink-black/50">
                            {story.createdAt?.toDate().toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {story.imageUrl && (
                          <div className="mb-3 -mx-4 -mt-2">
                            <div className="bg-white p-2 pb-4 border-b-2 border-ink-black inline-block rotate-1 shadow-sm">
                              <img
                                src={story.imageUrl}
                                alt=""
                                className="w-32 h-28 object-cover border border-ink-black/20 grayscale"
                              />
                            </div>
                          </div>
                        )}
                        <p className={`font-body-md text-body-md leading-relaxed mb-4 ${expired ? "italic opacity-70" : ""}`}>
                          {story.content}
                        </p>
                        <div className="flex justify-between items-center border-t border-ink-black pt-2">
                          <div className="flex gap-2">
                            <span className={`font-label-caps text-[9px] px-2 py-0.5 border border-ink-black ${
                              story.visibility === "public"
                                ? "bg-airmail-blue/10 text-airmail-blue"
                                : story.visibility === "unlisted"
                                  ? "text-postmark-gray"
                                  : "bg-stamp-red/10 text-stamp-red"
                            }`}>
                              {story.visibility.toUpperCase()}
                            </span>
                          </div>
                          <Link
                            href={`/app/story/${story.id}`}
                            className="font-label-caps text-[10px] text-airmail-blue hover:underline"
                          >
                            VIEW FULL &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center h-20 px-2 bg-paper-cream border-t-2 border-ink-black">
        <Link
          href="/app"
          className="flex flex-col items-center justify-center p-2 mx-1 text-ink-black hover:bg-surface-dim transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
          <span className="font-label-caps text-[10px] mt-1">MAP</span>
        </Link>
        <Link
          href="/app?tab=feed"
          className="flex flex-col items-center justify-center p-2 mx-1 text-ink-black hover:bg-surface-dim transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="font-label-caps text-[10px] mt-1">FEED</span>
        </Link>
        <Link
          href="/app/profile"
          className="flex flex-col items-center justify-center p-2 mx-1 bg-airmail-blue text-on-primary border-2 border-ink-black transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span className="font-label-caps text-[10px] mt-1">PROFILE</span>
        </Link>
        <a
          href="#"
          className="flex flex-col items-center justify-center p-2 mx-1 text-ink-black hover:bg-surface-dim transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <span className="font-label-caps text-[10px] mt-1">GLOBAL</span>
        </a>
      </nav>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthProvider>
      <ProfileInner />
    </AuthProvider>
  );
}
