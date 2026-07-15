"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LandingPage() {
  const t = useTranslations("landing");

  return (
    <div className="min-h-dvh bg-surface-dim paper-texture flex flex-col">
      <header className="bg-background border-b-2 border-ink-black flex items-center justify-between px-margin-mobile md:px-8 h-16">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-ink-black text-2xl">mail</span>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-ink-black uppercase tracking-tighter">
            {t("title")}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-metadata text-metadata text-ink-black/60 hidden sm:block">{t("est")}</span>
          <Link
            href="/app?mock"
            className="bg-airmail-blue text-on-primary border-2 border-ink-black px-4 py-2 font-label-caps text-label-caps font-bold active:translate-y-0.5 transition-transform"
          >
            {t("cta_enter")}
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-margin-mobile md:px-8 py-12 relative">
        <div className="max-w-xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-double border-ink-black rounded-full mb-8 bg-paper-cream shadow-[4px_4px_0px_0px_#1A1A1B] rotate-[-5deg]">
            <span className="material-symbols-outlined text-ink-black text-3xl">explore_nearby</span>
          </div>

          <h2 className="font-headline-lg text-headline-lg md:text-5xl md:leading-tight text-ink-black uppercase tracking-tighter mb-4">
            {t("tagline")}
          </h2>

          <p className="font-body-lg text-body-lg text-ink-black/70 mb-10 max-w-md mx-auto">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/app?mock"
              className="            bg-ink-black text-paper-cream border-2 border-ink-black px-8 py-4 font-headline-md text-headline-md uppercase tracking-widest shadow-[4px_4px_0px_0px_#1A1A1B] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              {t("cta_enter")}
            </Link>
            <Link
              href="/app"
              className="bg-paper-cream text-ink-black border-2 border-ink-black px-8 py-4 font-headline-md text-headline-md uppercase tracking-widest shadow-[4px_4px_0px_0px_#1A1A1B] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              {t("cta_live")}
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <span className="font-label-caps text-label-caps text-ink-black bg-airmail-blue/10 border-2 border-airmail-blue px-3 py-1">
              EPHEMERAL
            </span>
            <span className="font-label-caps text-label-caps text-ink-black bg-stamp-red/10 border-2 border-stamp-red px-3 py-1">
              JOURNEYS
            </span>
            <span className="font-label-caps text-label-caps text-ink-black bg-ink-black/10 border-2 border-ink-black px-3 py-1">
              NO BACKUPS
            </span>
            <span className="font-label-caps text-label-caps text-ink-black bg-postmark-gray/20 border-2 border-postmark-gray px-3 py-1">
              PRIVATE / PUBLIC
            </span>
          </div>
        </div>
      </main>

      <footer className="bg-ink-black text-paper-cream px-margin-mobile md:px-8 py-3 flex items-center justify-center font-metadata text-metadata">
        <span>{t("footer")} · {t("est")}</span>
      </footer>
    </div>
  );
}
