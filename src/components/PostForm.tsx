"use client";

import { useState, useRef } from "react";
import { createStory } from "@/lib/stories";
import { useAuth } from "@/lib/auth";
import type { Visibility } from "@/types";

export default function PostForm({
  position,
  onClose,
}: {
  position: [number, number] | null;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const formRef = useRef<HTMLDivElement>(null);

  if (!position) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    setSending(true);
    try {
      await createStory(
        text.trim(),
        position[0],
        position[1],
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        user.uid,
        user.displayName,
        visibility,
      );
      setText("");
      onClose();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end bg-black/50 sm:items-center sm:justify-center">
      <div
        ref={formRef}
        className="w-full rounded-t-2xl border border-gray-700 bg-gray-900 p-4 sm:max-w-md sm:rounded-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </p>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening here?"
            maxLength={280}
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 outline-none focus:border-blue-500"
          />
          <div className="mt-3 flex items-center gap-2">
            {(["public", "unlisted", "private"] as Visibility[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVisibility(v)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  visibility === v
                    ? v === "public"
                      ? "bg-green-600 text-white"
                      : v === "unlisted"
                        ? "bg-yellow-600 text-white"
                        : "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {v === "public" ? "🌍 Public" : v === "unlisted" ? "🔗 Unlisted" : "🔒 Private"}
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{text.length}/280</span>
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
        <p className="mt-2 text-xs text-gray-500">
          Expires in 24 hours ·{" "}
          {user?.displayName || "Anonymous"}
        </p>
      </div>
    </div>
  );
}
