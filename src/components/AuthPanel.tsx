"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function AuthPanel() {
  const { user, loading, login, register, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  if (loading) return null;

  if (user && !user.isAnonymous) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-metadata text-metadata text-ink-black/60 hidden sm:block">
          {user.displayName || user.email}
        </span>
        <button
          onClick={logout}
          className="border border-ink-black px-2 py-0.5 font-metadata text-[10px] text-ink-black/60 hover:bg-ink-black hover:text-paper-cream transition-colors active:translate-y-0.5"
        >
          SIGN OUT
        </button>
      </div>
    );
  }

  if (user?.isAnonymous) {
    return (
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="font-metadata text-metadata text-ink-black/60">ANON</span>
          <button
            onClick={() => {
              setExpanded(!expanded);
              setError("");
            }}
            className="material-symbols-outlined text-ink-black text-2xl hover:bg-surface-container-highest p-1 transition-colors cursor-pointer"
          >
            account_circle
          </button>
        </div>

        {expanded && (
          <div className="absolute right-0 top-full mt-2 w-72 z-50">
            <div className="bg-paper-cream border-2 border-ink-black shadow-[4px_4px_0px_0px_#1A1A1B] p-4">
              <div className="flex items-center justify-between mb-3 border-b-2 border-ink-black pb-2">
                <span className="font-label-caps text-label-caps text-ink-black uppercase">
                  {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                </span>
                <button
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="font-metadata text-[10px] text-airmail-blue hover:underline"
                >
                  {mode === "login" ? "REGISTER" : "SIGN IN"}
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError("");
                  try {
                    if (mode === "register") {
                      await register(email, password, name);
                    } else {
                      await login(email, password);
                    }
                    setExpanded(false);
                  } catch (err: unknown) {
                    setError((err as Error).message);
                  }
                }}
                className="flex flex-col gap-2"
              >
                {mode === "register" && (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Display name"
                    className="border-b-2 border-ink-black bg-transparent px-2 py-1 font-body-md text-body-md text-ink-black placeholder:text-ink-black/30 focus:outline-none focus:border-airmail-blue"
                  />
                )}
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  className="border-b-2 border-ink-black bg-transparent px-2 py-1 font-body-md text-body-md text-ink-black placeholder:text-ink-black/30 focus:outline-none focus:border-airmail-blue"
                />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  className="border-b-2 border-ink-black bg-transparent px-2 py-1 font-body-md text-body-md text-ink-black placeholder:text-ink-black/30 focus:outline-none focus:border-airmail-blue"
                />
                {error && (
                  <p className="text-stamp-red font-metadata text-[10px]">{error}</p>
                )}
                <button
                  type="submit"
                  className="bg-airmail-blue text-on-primary border-2 border-ink-black px-3 py-2 font-label-caps text-label-caps mt-1 active:translate-y-0.5 transition-transform"
                >
                  {mode === "register" ? "CREATE ACCOUNT" : "SIGN IN"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="material-symbols-outlined text-ink-black text-2xl hover:bg-surface-container-highest p-1 transition-colors cursor-pointer"
    >
      account_circle
    </button>
  );
}
