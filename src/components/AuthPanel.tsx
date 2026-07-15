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

  if (loading) return null;
  if (user && !user.isAnonymous) {
    return (
      <div className="flex items-center gap-2 font-metadata text-ink-black">
        <span className="opacity-60">{user.displayName || user.email}</span>
        <button
          onClick={logout}
          className="border border-ink-black px-2 py-0.5 hover:bg-ink-black hover:text-paper-cream transition-colors active:translate-y-0.5"
        >
          SIGN OUT
        </button>
      </div>
    );
  }

  if (user?.isAnonymous) {
    return (
      <div className="flex flex-col gap-2 font-metadata">
        <div className="flex items-center gap-2">
          <span className="text-ink-black/60">ANONYMOUS</span>
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="border border-ink-black px-2 py-0.5 text-ink-black hover:bg-airmail-blue hover:text-on-primary transition-colors active:translate-y-0.5"
          >
            {mode === "login" ? "SIGN IN" : "CREATE"}
          </button>
        </div>
        {mode === "register" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              try {
                await register(email, password, name);
              } catch (err: unknown) {
                setError((err as Error).message);
              }
            }}
            className="flex flex-col gap-2 p-3 border-2 border-ink-black bg-surface-container-low"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="DISPLAY NAME"
              className="border-b-2 border-ink-black bg-transparent px-2 py-1 font-body-md text-ink-black placeholder:text-ink-black/30 focus:outline-none focus:border-airmail-blue"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL"
              type="email"
              className="border-b-2 border-ink-black bg-transparent px-2 py-1 font-body-md text-ink-black placeholder:text-ink-black/30 focus:outline-none focus:border-airmail-blue"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              type="password"
              className="border-b-2 border-ink-black bg-transparent px-2 py-1 font-body-md text-ink-black placeholder:text-ink-black/30 focus:outline-none focus:border-airmail-blue"
            />
            {error && <p className="text-stamp-red font-metadata">{error}</p>}
            <button
              type="submit"
              className="bg-airmail-blue text-on-primary border-2 border-ink-black px-3 py-1 font-label-caps active:translate-y-0.5 transition-transform"
            >
              CREATE ACCOUNT
            </button>
          </form>
        )}
        {mode === "login" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              try {
                await login(email, password);
              } catch (err: unknown) {
                setError((err as Error).message);
              }
            }}
            className="flex flex-col gap-2 p-3 border-2 border-ink-black bg-surface-container-low"
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL"
              type="email"
              className="border-b-2 border-ink-black bg-transparent px-2 py-1 font-body-md text-ink-black placeholder:text-ink-black/30 focus:outline-none focus:border-airmail-blue"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              type="password"
              className="border-b-2 border-ink-black bg-transparent px-2 py-1 font-body-md text-ink-black placeholder:text-ink-black/30 focus:outline-none focus:border-airmail-blue"
            />
            {error && <p className="text-stamp-red font-metadata">{error}</p>}
            <button
              type="submit"
              className="bg-airmail-blue text-on-primary border-2 border-ink-black px-3 py-1 font-label-caps active:translate-y-0.5 transition-transform"
            >
              SIGN IN
            </button>
          </form>
        )}
      </div>
    );
  }

  return null;
}
