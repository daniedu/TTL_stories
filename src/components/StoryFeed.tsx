"use client";

import type { Story } from "@/types";
import { deleteStory, reportStory } from "@/lib/stories";
import Link from "next/link";

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

function StoryCard({ story, userId }: { story: Story; userId: string | null }) {
  const expired = story.expiresAt.seconds * 1000 <= Date.now();
  const stampColor =
    story.visibility === "public"
      ? "text-airmail-blue border-airmail-blue bg-blue-50"
      : story.visibility === "unlisted"
        ? "text-postmark-gray border-postmark-gray bg-gray-50"
        : "text-stamp-red border-stamp-red bg-red-50";

  return (
    <div
      className={`bg-paper-cream border-2 border-ink-black p-4 md:p-6 shadow-[4px_4px_0px_0px_#1A1A1B] relative group cursor-pointer transition-all hover:shadow-[2px_2px_0px_0px_#1A1A1B] hover:translate-x-0.5 hover:translate-y-0.5 ${
        expired ? "opacity-80 grayscale" : ""
      }`}
    >
      {expired && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 select-none">
          <span className="text-7xl font-bold border-8 border-ink-black px-8 py-2 rotate-12 font-headline-lg">
            POSTED
          </span>
        </div>
      )}

      <div className="absolute top-3 right-3 z-10">
        <div
          className={`w-12 h-14 border-2 flex flex-col items-center justify-center rotate-3 font-bold perforated-edge ${stampColor}`}
        >
          <span className="font-headline-md text-[16px] leading-none text-ink-black">
            {timeLeft(story.expiresAt)}
          </span>
          <span className="font-metadata text-[8px] text-ink-black/60 uppercase leading-tight">
            left
          </span>
        </div>
      </div>

      <div className="mb-3 pr-14">
        <span className="font-label-caps text-[10px] text-ink-black/60 uppercase">
          FROM: {story.authorName || "ANONYMOUS"}
        </span>
        <div className="font-metadata text-[10px] text-ink-black/40 mt-0.5">
          NO. {story.id.slice(-4).toUpperCase()} /{" "}
          {story.location.latitude.toFixed(2)}, {story.location.longitude.toFixed(2)}
        </div>
      </div>

      {story.imageUrl && (
        <div className="mb-3 -ml-1">
          <div className="bg-white p-2 pb-5 border border-ink-black inline-block -rotate-1 shadow-sm hover:rotate-0 transition-transform">
            <img
              src={story.imageUrl}
              alt=""
              className="w-28 h-24 md:w-32 md:h-28 object-cover border border-ink-black/10 grayscale"
            />
            <p className="font-metadata text-[8px] text-center text-ink-black/40 mt-1 uppercase">
              Attachment
            </p>
          </div>
        </div>
      )}

      <Link href={`/story/${story.id}`}>
        <p className="font-body-md text-body-md text-ink-black leading-relaxed mb-4 line-clamp-4 hover:text-airmail-blue transition-colors">
          {story.content}
        </p>
      </Link>

      <div className="flex items-center justify-between pt-3 border-t border-ink-black/20">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              story.visibility === "public"
                ? "bg-airmail-blue"
                : story.visibility === "unlisted"
                  ? "bg-ink-black"
                  : "bg-stamp-red"
            }`}
          />
          <span className="font-metadata text-[10px] text-ink-black/60 uppercase">
            {story.visibility === "public" ? "PUBLIC" : story.visibility === "unlisted" ? "UNLISTED" : "PRIVATE"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-metadata text-[10px] text-ink-black/40">
            {story.createdAt?.toDate().toLocaleString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                copyShareLink(story.id);
              }}
              className="border border-ink-black px-1.5 py-0.5 font-metadata text-[9px] text-ink-black/60 hover:bg-airmail-blue hover:text-on-primary transition-colors active:translate-y-0.5"
            >
              SHARE
            </button>
            {story.authorId === userId && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteStory(story.id);
                }}
                className="border border-ink-black px-1.5 py-0.5 font-metadata text-[9px] text-ink-black/60 hover:bg-stamp-red hover:text-on-primary transition-colors active:translate-y-0.5"
              >
                DELETE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StoryFeed({
  stories,
  userId,
  compact,
}: {
  stories: Story[];
  userId: string | null;
  compact?: boolean;
}) {
  if (stories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 font-body-md text-postmark-gray">
        No stories yet. Tap the map to post one.
      </div>
    );
  }

  if (compact) {
    return (
      <div className="divide-y-2 divide-ink-black">
        {stories.map((story) => (
          <div
            key={story.id}
            className="p-4 border-b-2 border-ink-black hover:bg-surface-bright transition-colors relative group cursor-pointer"
          >
            <div className="absolute top-3 right-3 w-9 h-11 border-2 border-dashed border-ink-black flex flex-col items-center justify-center bg-white -rotate-3 group-hover:rotate-3 transition-transform opacity-60">
              <span className="font-metadata text-[7px] font-bold leading-none text-ink-black/60">
                {timeLeft(story.expiresAt)}
              </span>
            </div>
            <p className="font-metadata text-[10px] text-postmark-gray mb-0.5 uppercase">
              NO. {story.id.slice(-4).toUpperCase()} / {story.authorName || "ANONYMOUS"}
            </p>
            <h3 className="font-headline-md text-[16px] mb-1 leading-tight text-ink-black line-clamp-1">
              {story.content}
            </h3>
            <p className="font-body-md text-[13px] text-ink-black/70 line-clamp-2 mb-2">
              {story.content}
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`font-label-caps text-[9px] px-1.5 py-0.5 border border-ink-black ${
                  story.visibility === "public"
                    ? "bg-airmail-blue/10 text-airmail-blue"
                    : story.visibility === "unlisted"
                      ? "text-postmark-gray"
                      : "bg-stamp-red/10 text-stamp-red"
                }`}
              >
                {story.visibility === "public" ? "PUBLIC" : story.visibility === "unlisted" ? "UNLISTED" : "PRIVATE"}
              </span>
              <span className="font-metadata text-[10px] text-ink-black/50 italic">
                -- {story.authorName || "Anonymous"}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 pb-28">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} userId={userId} />
      ))}
    </div>
  );
}
