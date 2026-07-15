"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-surface-dim paper-texture flex flex-col">
      <header className="bg-background border-b-2 border-ink-black flex items-center justify-between px-margin-mobile md:px-8 h-16">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-ink-black text-2xl hidden md:block">mail</span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-ink-black uppercase tracking-tighter">
            TTL STORIES
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-metadata text-metadata text-ink-black/60 hidden sm:block">EST. 2024</span>
          <Link
            href="/app?mock"
            className="bg-airmail-blue text-on-primary border-2 border-ink-black px-4 py-2 font-label-caps text-label-caps font-bold active:translate-y-0.5 transition-transform hover:bg-primary"
          >
            ENTER ARCHIVE
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-margin-mobile md:px-8 py-12 relative">
        <div className="absolute top-20 right-10 opacity-5 pointer-events-none rotate-12 hidden md:block">
          <div className="w-64 h-64 border-8 border-ink-black rounded-full flex items-center justify-center">
            <span className="font-headline-lg text-9xl text-ink-black">POST</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 border-4 border-double border-ink-black rounded-full mb-8 bg-paper-cream shadow-[4px_4px_0px_0px_#1A1A1B] -rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-ink-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
            </svg>
          </div>

          <h2 className="font-headline-lg text-headline-lg md:text-6xl md:leading-tight text-ink-black uppercase tracking-tighter mb-6">
            Correspondence<br className="md:hidden" /> Post
          </h2>

          <p className="font-body-lg text-body-lg text-ink-black/80 mb-8 max-w-lg mx-auto">
            Ephemeral location-based stories delivered like telegrams. Drop a message anywhere in the world and watch it fade within 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/app?mock"
              className="bg-ink-black text-paper-cream border-2 border-ink-black px-8 py-4 font-headline-md text-headline-md uppercase tracking-widest shadow-[4px_4px_0px_0px_#1A1A1B] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Enter the Archive
            </Link>
            <Link
              href="/app"
              className="bg-paper-cream text-ink-black border-2 border-ink-black px-8 py-4 font-headline-md text-headline-md uppercase tracking-widest shadow-[4px_4px_0px_0px_#1A1A1B] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Live Dispatch
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-paper-cream border-2 border-ink-black p-6 shadow-[4px_4px_0px_0px_#1A1A1B]">
              <span className="font-headline-md text-headline-md text-airmail-blue block mb-2">01</span>
              <h3 className="font-label-caps text-label-caps text-ink-black uppercase mb-2">Ephemeral</h3>
              <p className="font-body-md text-body-md text-ink-black/70">
                Stories self-destruct in 24 hours. Like a telegram from the past, each message is a fleeting artifact.
              </p>
            </div>
            <div className="bg-paper-cream border-2 border-ink-black p-6 shadow-[4px_4px_0px_0px_#1A1A1B]">
              <span className="font-headline-md text-headline-md text-stamp-red block mb-2">02</span>
              <h3 className="font-label-caps text-label-caps text-ink-black uppercase mb-2">Location-Based</h3>
              <p className="font-body-md text-body-md text-ink-black/70">
                Pin stories to real places. Discover what people are saying around you or anywhere on the globe.
              </p>
            </div>
            <div className="bg-paper-cream border-2 border-ink-black p-6 shadow-[4px_4px_0px_0px_#1A1A1B]">
              <span className="font-headline-md text-headline-md text-postmark-gray block mb-2">03</span>
              <h3 className="font-label-caps text-label-caps text-ink-black uppercase mb-2">Private or Public</h3>
              <p className="font-body-md text-body-md text-ink-black/70">
                Choose who sees your dispatch. Public, unlisted, or private — you control the delivery.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-ink-black text-paper-cream px-margin-mobile md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 font-metadata text-metadata">
        <span>TTL STORIES — CORRESPONDENCE POST</span>
        <span>DISPATCH NO. {Math.floor(Math.random() * 9999)} · EST. 2024</span>
      </footer>
    </div>
  );
}
