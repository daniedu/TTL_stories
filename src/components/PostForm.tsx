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
    <div className="fixed inset-0 z-[9999] flex items-end bg-ink-black/50 sm:items-center sm:justify-center">
      <div
        ref={formRef}
        className="relative w-full max-w-[600px] bg-paper-cream border-4 border-ink-black shadow-[8px_8px_0px_0px_rgba(26,26,27,1)] overflow-hidden sm:mb-0"
      >
        <header className="bg-ink-black text-paper-cream px-6 py-4 flex justify-between items-center border-b-4 border-ink-black">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile tracking-tighter uppercase">TELEGRAM</h2>
          <button onClick={onClose} className="text-paper-cream hover:bg-tertiary p-1 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </header>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-label-caps uppercase text-metadata">
            <div className="space-y-1">
              <label className="block text-ink-black/60">To: [Location]</label>
              <input
                className="w-full bg-transparent border-b-2 border-ink-black border-t-0 border-x-0 focus:outline-none focus:border-airmail-blue font-body-md py-1 text-ink-black"
                placeholder="GRID SECTOR"
                value={`${position[0].toFixed(4)}, ${position[1].toFixed(4)}`}
                readOnly
                type="text"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-ink-black/60">From: [Operator]</label>
              <input
                className="w-full bg-transparent border-b-2 border-ink-black border-t-0 border-x-0 focus:outline-none font-body-md py-1 text-ink-black/70"
                readOnly
                type="text"
                value={user?.displayName || "ANONYMOUS"}
              />
            </div>
          </div>

          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="STOP. WRITE YOUR MESSAGE HERE STOP..."
              maxLength={280}
              rows={6}
              className="w-full bg-transparent border-2 border-ink-black p-3 focus:outline-none focus:border-airmail-blue font-body-lg text-body-lg resize-none placeholder:text-ink-black/30 text-ink-black"
            />
            <div className={`absolute bottom-2 right-2 font-label-caps text-metadata bg-paper-cream px-2 py-1 border border-ink-black ${text.length >= 250 ? "text-stamp-red" : "text-ink-black"}`}>
              {text.length}/280
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-label-caps text-metadata text-ink-black/60 uppercase">Select Dispatch Priority:</label>
            <div className="flex flex-wrap gap-3">
              {(["public", "unlisted", "private"] as Visibility[]).map((v) => {
                const isActive = visibility === v;
                const colorClass =
                  v === "public"
                    ? "border-airmail-blue text-airmail-blue hover:bg-airmail-blue hover:text-on-primary"
                    : v === "unlisted"
                      ? "border-postmark-gray text-postmark-gray hover:bg-postmark-gray hover:text-on-primary"
                      : "border-stamp-red text-stamp-red hover:bg-stamp-red hover:text-on-primary";
                const activeClass = isActive
                  ? v === "public"
                    ? "bg-airmail-blue text-on-primary"
                    : v === "unlisted"
                      ? "bg-postmark-gray text-on-primary"
                      : "bg-stamp-red text-on-primary"
                  : "";
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v)}
                    className={`rubber-stamp flex items-center gap-2 border-2 px-4 py-2 font-headline-md transition-all ${colorClass} ${activeClass}`}
                  >
                    <span className="text-label-caps uppercase">{v}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t-2 border-ink-black flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-metadata leading-tight text-ink-black/60 uppercase">
              Expires in 24 hours
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={sending || !text.trim() || !user}
              className="relative group active:translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="bg-secondary text-on-secondary px-10 py-4 font-headline-lg-mobile uppercase tracking-widest border-2 border-ink-black shadow-[4px_4px_0px_0px_rgba(26,26,27,1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                {sending ? "DISPATCHING..." : "SEND"}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
