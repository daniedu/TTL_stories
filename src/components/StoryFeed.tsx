"use client";

import type { Story } from "@/types";
import { deleteStory, reportStory } from "@/lib/stories";

function copyShareLink(id: string) {
  const url = `${window.location.origin}/story/${id}`;
  navigator.clipboard.writeText(url);
}

function timeLeft(expiresAt: Story["expiresAt"]): string {
  const remaining = expiresAt.seconds * 1000 - Date.now();
  if (remaining <= 0) return "EXPIRED";
  const mins = Math.floor(remaining / 1000 / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m`;
}

export default function StoryFeed({
  stories,
  userId,
}: {
  stories: Story[];
  userId: string | null;
}) {
  if (stories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 font-body-md text-postmark-gray">
        No stories yet. Tap the map to post one.
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-y-auto p-4 pb-24 custom-scrollbar">
      {stories.map((story) => {
        const expired = story.expiresAt.seconds * 1000 <= Date.now();
        const stampColor =
          story.visibility === "public"
            ? "text-airmail-blue border-airmail-blue bg-blue-50"
            : story.visibility === "unlisted"
              ? "text-postmark-gray border-postmark-gray bg-gray-50"
              : "text-stamp-red border-stamp-red bg-red-50";

        return (
          <div
            key={story.id}
            className={`relative max-w-container-max mx-auto bg-paper-cream border-2 border-ink-black p-6 shadow-[4px_4px_0px_0px_#1A1A1B] ${
              expired ? "opacity-80 grayscale" : ""
            }`}
          >
            {expired && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 rotate-[-25deg]">
                <span className="text-8xl font-bold border-8 border-ink-black px-10 py-4 font-headline-lg">
                  POSTED
                </span>
              </div>
            )}

            <div className="absolute top-0 right-0 p-3 z-10">
              <div
                className={`w-14 h-14 border-2 flex items-center justify-center rotate-3 font-bold text-[10px] perforated-edge ${stampColor}`}
              >
                <div className="text-center leading-tight">
                  <span className="block font-headline-md text-ink-black">{timeLeft(story.expiresAt)}</span>
                  <span className="font-metadata text-postmark-gray uppercase">left</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <span className="font-label-caps text-metadata text-ink-black/60">
                FROM: {story.authorName || "ANONYMOUS"}
              </span>
              <h3 className="font-headline-md mt-1 text-ink-black">{story.content.slice(0, 60)}{story.content.length > 60 ? "..." : ""}</h3>
            </div>

            <p className="font-body-md text-ink-black leading-relaxed mb-4">
              {story.content}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-ink-black/20">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full shadow-sm ${
                    story.visibility === "public"
                      ? "bg-airmail-blue"
                      : story.visibility === "unlisted"
                        ? "bg-ink-black"
                        : "bg-stamp-red"
                  }`}
                />
                <span className="font-metadata text-ink-black/60 uppercase">
                  {story.visibility === "public" ? "PUBLIC DISPATCH" : story.visibility === "unlisted" ? "UNLISTED DISPATCH" : "PRIVATE DISPATCH"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-metadata text-ink-black/60">
                  {story.createdAt?.toDate().toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => copyShareLink(story.id)}
                    className="border border-ink-black px-2 py-0.5 font-metadata text-ink-black/60 hover:bg-airmail-blue hover:text-on-primary transition-colors active:translate-y-0.5"
                    title="Copy share link"
                  >
                    SHARE
                  </button>
                  <button
                    onClick={() => reportStory(story.id)}
                    className="border border-ink-black px-2 py-0.5 font-metadata text-ink-black/60 hover:bg-stamp-red hover:text-on-primary transition-colors active:translate-y-0.5"
                    title="Report"
                  >
                    REPORT
                  </button>
                  {story.authorId === userId && (
                    <button
                      onClick={() => deleteStory(story.id)}
                      className="border border-ink-black px-2 py-0.5 font-metadata text-ink-black/60 hover:bg-ink-black hover:text-paper-cream transition-colors active:translate-y-0.5"
                    >
                      DELETE
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
