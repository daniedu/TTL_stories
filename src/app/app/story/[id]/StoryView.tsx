"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import type { Story } from "@/types";

function timeLeft(expiresAt: Story["expiresAt"]): string {
  const remaining = expiresAt.seconds * 1000 - Date.now();
  if (remaining <= 0) return "EXPIRED";
  const mins = Math.floor(remaining / 1000 / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m`;
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
      <main className="min-h-dvh flex flex-col items-center justify-center bg-surface-dim paper-texture px-4">
        <div className="border-4 border-double border-ink-black p-8 max-w-sm bg-paper-cream text-center">
          <h1 className="font-headline-lg text-headline-lg text-ink-black uppercase mb-2">
            PRIVATE DISPATCH
          </h1>
          <p className="font-body-md text-body-md text-ink-black/60">
            You don&apos;t have access to this story.
          </p>
        </div>
      </main>
    );
  }

  const expired = story.expiresAt.seconds * 1000 <= Date.now();

  if (expired) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-surface-dim paper-texture px-4">
        <div className="border-4 border-double border-ink-black p-8 max-w-sm bg-paper-cream text-center">
          <h1 className="font-headline-lg text-headline-lg text-ink-black uppercase mb-2">
            STORY EXPIRED
          </h1>
          <p className="font-body-md text-body-md text-ink-black/60">
            This story is no longer available.
          </p>
        </div>
      </main>
    );
  }

  const stampLabel =
    story.visibility === "public"
      ? { bg: "bg-airmail-blue", label: "AIR MAIL", border: "border-airmail-blue", text: "text-airmail-blue" }
      : story.visibility === "unlisted"
        ? { bg: "bg-ink-black", label: "UNLISTED", border: "border-ink-black", text: "text-ink-black" }
        : { bg: "bg-stamp-red", label: "PRIVATE", border: "border-stamp-red", text: "text-stamp-red" };

  return (
    <main className="min-h-dvh flex flex-col bg-surface-dim paper-texture">
      <header className="bg-background border-b-2 border-ink-black flex items-center justify-between px-margin-mobile md:px-8 h-16">
        <div className="flex items-center gap-4">
          <Link
            href="/app"
            className="material-symbols-outlined text-ink-black text-2xl hover:bg-surface-container-highest p-2 transition-colors"
          >
            arrow_back
          </Link>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-ink-black uppercase tracking-tighter">
            TTLive
          </h1>
        </div>
        <span className="font-label-caps text-label-caps text-ink-black/60">
          DISPATCH
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <article className="relative max-w-container-max w-full bg-paper-cream paper-texture p-8 md:p-12 border-2 border-ink-black shadow-[8px_8px_0px_0px_#1A1A1B] flex flex-col gap-8">
          <Link
            href="/app"
            className="absolute top-4 left-4 z-20 border border-ink-black px-2 py-1 font-metadata text-[10px] text-ink-black/60 hover:bg-airmail-blue hover:text-on-primary transition-colors"
          >
            &larr; BACK
          </Link>

          <div className="absolute -top-4 -right-4 w-28 h-32 bg-white border-2 border-ink-black p-1 flex flex-col items-center justify-center shadow-[4px_4px_0px_0px_#1A1A1B] rotate-3 z-20">
            <div className="w-full h-full border border-postmark-gray flex flex-col items-center justify-center relative overflow-hidden">
              <div className={`w-full text-center font-label-caps text-[10px] py-1 ${stampLabel.bg} text-white`}>
                {stampLabel.label}
              </div>
              <div className="flex-1 flex flex-col items-center justify-center py-1">
                <span className="font-headline-md text-[16px] text-ink-black">
                  {timeLeft(story.expiresAt)}
                </span>
                <span className="font-metadata text-[8px] text-postmark-gray uppercase">
                  remaining
                </span>
              </div>
            </div>
          </div>

          <div className="border-b-2 border-ink-black pb-4 flex flex-col gap-2">
            <div className="flex items-baseline gap-4">
              <span className="font-label-caps text-label-caps text-ink-black/60">TO:</span>
              <span className="font-headline-md text-headline-md text-ink-black uppercase">
                THE WORLD
              </span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="font-label-caps text-label-caps text-ink-black/60">FROM:</span>
              <span className="font-headline-md text-headline-md text-ink-black uppercase">
                {story.authorName || "ANONYMOUS"}
              </span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="font-label-caps text-label-caps text-ink-black/60">LOC:</span>
              <span className="font-metadata text-metadata text-ink-black">
                {story.location.latitude.toFixed(4)}, {story.location.longitude.toFixed(4)}
              </span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="font-label-caps text-label-caps text-ink-black/60">SENT:</span>
              <span className="font-metadata text-metadata text-ink-black">
                {story.createdAt?.seconds
                  ? new Date(story.createdAt.seconds * 1000).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
            </div>
          </div>

          <div className="py-4">
            <p className="font-headline-lg text-headline-lg md:text-[22px] text-ink-black leading-relaxed whitespace-pre-wrap">
              {story.content}
            </p>
          </div>

          <div className="mt-auto pt-6 flex flex-wrap items-end justify-between gap-6 border-t-2 border-ink-black">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-ink-black/40 mb-1">
                AUTHENTICATED BY
              </span>
              <div className={`rubber-stamp border-2 px-3 py-1 font-headline-md text-headline-md uppercase ${stampLabel.border} ${stampLabel.text}`}>
                {story.authorName || "ANONYMOUS"}
              </div>
            </div>
            <div className="relative">
              <div className={`postmark-circle w-20 h-20 flex-col ${stampLabel.border} ${stampLabel.text}`}>
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
