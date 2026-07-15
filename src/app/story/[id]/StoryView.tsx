"use client";

import { useAuth } from "@/lib/auth";
import type { Story } from "@/types";

function timeLeft(expiresAt: Story["expiresAt"]): string {
  const remaining = expiresAt.seconds * 1000 - Date.now();
  if (remaining <= 0) return "Expired";
  const mins = Math.floor(remaining / 1000 / 60);
  if (mins < 60) return `${mins}m remaining`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m remaining`;
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
      <main className="flex h-dvh flex-col items-center justify-center bg-gray-950 px-4 text-center">
        <h1 className="mb-2 text-xl font-bold text-white">Private Story</h1>
        <p className="text-sm text-gray-400">You don&apos;t have access to this story.</p>
      </main>
    );
  }

  const expired = story.expiresAt.seconds * 1000 <= Date.now();

  if (expired) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center bg-gray-950 px-4 text-center">
        <h1 className="mb-2 text-xl font-bold text-white">Story Expired</h1>
        <p className="text-sm text-gray-400">This story is no longer available.</p>
      </main>
    );
  }

  return (
    <main className="flex h-dvh flex-col bg-gray-950">
      <header className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <h1 className="text-base font-bold text-white">TTL Stories</h1>
        <span className="text-xs text-gray-500">{timeLeft(story.expiresAt)}</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6">
          <p className="text-lg leading-relaxed text-white">{story.content}</p>

          <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
            <span>{story.authorName || "Anonymous"}</span>
            <span>{story.visibility}</span>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {story.createdAt?.seconds
              ? new Date(story.createdAt.seconds * 1000).toLocaleString()
              : ""}
          </div>
        </div>
      </div>
    </main>
  );
}
