"use client";

import { useAuth } from "@/lib/auth";
import type { Story } from "@/types";

function timeLeft(expiresAt: Story["expiresAt"]): string {
  const remaining = expiresAt.seconds * 1000 - Date.now();
  if (remaining <= 0) return "EXPIRED";
  const mins = Math.floor(remaining / 1000 / 60);
  if (mins < 60) return `${mins}m REMAINING`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m REMAINING`;
}

export default function StoryView({ story }: { story: Story }) {
  const { user } = useAuth();

  const isOwner = user?.uid === story.authorId;
  const isAccessible =
    story.visibility === "public" ||
    story.visibility === "unlisted" ||
    (story.visibility === "private" && isOwner);

  if (!isAccessible) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center bg-surface-dim px-4 text-center">
        <div className="border-4 border-double border-ink-black p-8 max-w-sm">
          <h1 className="font-headline-lg text-headline-lg text-ink-black uppercase mb-2">PRIVATE DISPATCH</h1>
          <p className="font-body-md text-ink-black/60">You don&apos;t have access to this story.</p>
        </div>
      </main>
    );
  }

  const expired = story.expiresAt.seconds * 1000 <= Date.now();

  if (expired) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center bg-surface-dim px-4 text-center">
        <div className="border-4 border-double border-ink-black p-8 max-w-sm">
          <h1 className="font-headline-lg text-headline-lg text-ink-black uppercase mb-2">STORY EXPIRED</h1>
          <p className="font-body-md text-ink-black/60">This story is no longer available.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col bg-surface-dim paper-texture">
      <header className="bg-background border-b-2 border-ink-black flex items-center justify-between px-margin-mobile py-4">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-ink-black uppercase tracking-tighter">TTL STORIES</h1>
        <span className="font-label-caps text-metadata text-ink-black/60">{timeLeft(story.expiresAt)}</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <article className="relative max-w-container-max w-full bg-paper-cream border-2 border-ink-black p-8 md:p-12 shadow-[8px_8px_0px_0px_#1A1A1B] flex flex-col gap-6">
          <div className="absolute -top-4 -right-4 w-28 h-32 bg-white border-2 border-ink-black p-1 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_#1A1A1B] rotate-3 z-20">
            <div className="w-full h-full border border-postmark-gray flex flex-col items-center justify-center relative overflow-hidden">
              <div
                className={`w-full text-center font-label-caps text-[10px] py-1 ${
                  story.visibility === "public"
                    ? "bg-airmail-blue text-on-primary"
                    : story.visibility === "unlisted"
                      ? "bg-ink-black text-paper-cream"
                      : "bg-stamp-red text-on-primary"
                }`}
              >
                {story.visibility === "public" ? "AIR MAIL" : story.visibility === "unlisted" ? "UNLISTED" : "PRIVATE"}
              </div>
              <div className="flex-grow flex flex-col items-center justify-center py-2">
                <span className="font-headline-md text-ink-black">{timeLeft(story.expiresAt)}</span>
              </div>
            </div>
          </div>

          <div className="border-b-2 border-ink-black pb-4 flex flex-col gap-2">
            <div className="flex items-baseline gap-4">
              <span className="font-label-caps text-ink-black/60">TO:</span>
              <span className="font-headline-md text-ink-black uppercase">THE WORLD</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="font-label-caps text-ink-black/60">FROM:</span>
              <span className="font-headline-md text-ink-black uppercase">{story.authorName || "ANONYMOUS"}</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="font-label-caps text-ink-black/60">LOC:</span>
              <span className="font-metadata text-ink-black">
                {story.location.latitude.toFixed(4)}, {story.location.longitude.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="py-4">
            <p className="font-headline-lg text-headline-lg text-ink-black leading-relaxed whitespace-pre-wrap">
              {story.content}
            </p>
          </div>

          <div className="mt-auto pt-6 flex flex-wrap items-end justify-between gap-4 border-t-2 border-ink-black">
            <div className="flex flex-col">
              <span className="font-label-caps text-ink-black/40 mb-1">AUTHENTICATED BY</span>
              <div
                className={`rubber-stamp border-2 px-3 py-1 font-headline-md uppercase ${
                  story.visibility === "public"
                    ? "text-airmail-blue border-airmail-blue"
                    : story.visibility === "unlisted"
                      ? "text-postmark-gray border-postmark-gray"
                      : "text-stamp-red border-stamp-red"
                }`}
              >
                {story.authorName || "ANONYMOUS"}
              </div>
            </div>
            <div className="relative">
              <div
                className={`postmark-circle w-20 h-20 flex-col ${
                  story.visibility === "public"
                    ? "border-airmail-blue text-airmail-blue"
                    : story.visibility === "unlisted"
                      ? "border-postmark-gray text-postmark-gray"
                      : "border-stamp-red text-stamp-red"
                }`}
              >
                <span className="font-metadata text-[10px] uppercase">{story.visibility}</span>
                <span className="font-label-caps text-xs">DISPATCH</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
