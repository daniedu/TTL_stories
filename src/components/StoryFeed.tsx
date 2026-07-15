"use client";

import type { Story } from "@/types";
import { deleteStory, reportStory } from "@/lib/stories";

function copyShareLink(id: string) {
  const url = `${window.location.origin}/story/${id}`;
  navigator.clipboard.writeText(url);
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
      <div className="flex items-center justify-center py-12 text-sm text-gray-500">
        No stories yet. Tap the map to post one.
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto p-4">
      {stories.map((story) => (
        <div
          key={story.id}
          className="rounded-lg border border-gray-800 bg-gray-900 p-3"
        >
          <div className="flex items-start justify-between">
            <p className="text-sm text-white">{story.content}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => copyShareLink(story.id)}
                className="text-xs text-gray-500 hover:text-blue-400"
                title="Copy share link"
              >
                🔗
              </button>
              <button
                onClick={() => reportStory(story.id)}
                className="text-xs text-gray-500 hover:text-yellow-400"
                title="Report"
              >
                ⚑
              </button>
              {story.authorId === userId && (
                <button
                  onClick={() => deleteStory(story.id)}
                  className="text-xs text-gray-500 hover:text-red-400"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            <span>{story.authorName || "Anonymous"}</span>
            <span>·</span>
            <span>
              {story.createdAt?.toDate().toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>·</span>
            <span
              className={
                story.visibility === "public"
                  ? "text-green-500"
                  : story.visibility === "unlisted"
                    ? "text-yellow-500"
                    : "text-red-500"
              }
            >
              {story.visibility === "public" ? "🌍" : story.visibility === "unlisted" ? "🔗" : "🔒"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
