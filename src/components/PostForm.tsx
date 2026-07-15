"use client";

import { useState } from "react";
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
  const [imageUrl, setImageUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>("public");

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
        imageUrl || undefined,
      );
      setText("");
      onClose();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center md:justify-center bg-ink-black/80">
      <div className="relative w-full max-w-[600px] bg-paper-cream border-2 border-ink-black shadow-[12px_12px_0px_0px_#1A1A1B] md:mx-4 max-h-[90dvh] overflow-y-auto flex flex-col">
        <header className="border-b-2 border-ink-black p-gutter flex flex-col gap-3 bg-paper-cream shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-ink-black/60">
                FORM NO. 72-B
              </span>
              <h1 className="font-headline-lg text-headline-lg text-ink-black uppercase tracking-tighter">
                TELEGRAM CONVEYANCE
              </h1>
            </div>
            <button
              onClick={onClose}
              className="text-ink-black hover:bg-surface-container-higher p-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-gutter">
            <div className="border-b-2 border-ink-black flex items-end pb-1">
              <label className="font-label-caps text-label-caps mr-2 pb-1 shrink-0">FROM:</label>
              <input
                className="bg-transparent border-none focus:outline-none p-0 font-body-lg text-body-lg w-full text-ink-black"
                readOnly
                type="text"
                value={user?.displayName || "ANONYMOUS"}
              />
            </div>
            <div className="border-b-2 border-ink-black flex items-end pb-1">
              <label className="font-label-caps text-label-caps mr-2 pb-1 shrink-0">LOC:</label>
              <input
                className="bg-transparent border-none focus:outline-none p-0 font-body-lg text-body-lg w-full text-ink-black"
                readOnly
                type="text"
                value={`${position[0].toFixed(4)}, ${position[1].toFixed(4)}`}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 p-gutter relative min-h-[200px]">
          <div className="relative h-full">
            <label className="font-label-caps text-label-caps block mb-3 text-ink-black/60">
              MESSAGE CONTENTS (MAX 280 CHARS):
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="TYPE YOUR MESSAGE HERE..."
              maxLength={280}
              rows={6}
              className="w-full bg-transparent border-2 border-ink-black p-3 focus:outline-none focus:bg-white font-body-lg text-body-lg resize-none text-ink-black placeholder:text-ink-black/30"
            />
            <div className="mt-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-ink-black/40 text-lg">image</span>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="ENCLOSE IMAGE URL (OPTIONAL)"
                className="flex-1 bg-transparent border-b-2 border-ink-black/30 focus:border-airmail-blue px-2 py-1 font-metadata text-metadata text-ink-black placeholder:text-ink-black/30 focus:outline-none transition-colors"
              />
            </div>
            {imageUrl && (
              <div className="mt-2 ml-8">
                <div className="bg-white p-1 pb-3 border border-ink-black inline-block shadow-sm">
                  <img src={imageUrl} alt="" className="w-20 h-16 object-cover border border-ink-black/10" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="border-t-2 border-ink-black bg-surface-container flex flex-col md:flex-row shrink-0">
          <div className="flex-1 p-3 flex items-center gap-3 border-b-2 md:border-b-0 md:border-r-2 border-ink-black flex-wrap">
            <span className="font-label-caps text-label-caps text-ink-black/60 shrink-0">
              CLASSIFICATION:
            </span>
            <div className="flex gap-2 flex-wrap">
              {(["public", "unlisted", "private"] as Visibility[]).map((v) => {
                const isActive = visibility === v;
                const baseClass =
                  v === "public"
                    ? "border-airmail-blue text-airmail-blue"
                    : v === "unlisted"
                      ? "border-postmark-gray text-postmark-gray"
                      : "border-stamp-red text-stamp-red";
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v)}
                    className={`flex items-center gap-1 border-2 border-ink-black px-3 py-1 transition-all active:scale-95 font-label-caps text-label-caps ${
                      isActive
                        ? `${v === "public" ? "bg-airmail-blue" : v === "unlisted" ? "bg-postmark-gray" : "bg-stamp-red"} text-white`
                        : "bg-transparent text-ink-black hover:bg-surface-dim"
                    }`}
                  >
                    {v.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-stretch">
            <div className="px-4 flex items-center border-r-2 border-ink-black bg-paper-cream">
              <span
                className={`font-headline-md text-headline-md ${
                  text.length >= 250 ? "text-stamp-red" : "text-ink-black"
                }`}
              >
                {280 - text.length}
              </span>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={sending || !text.trim() || !user}
              className="bg-stamp-red text-white font-headline-lg text-headline-lg px-10 py-4 uppercase tracking-widest hover:bg-secondary active:translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "..." : "SEND"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
