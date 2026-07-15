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
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>{user.displayName || user.email}</span>
        <button onClick={logout} className="hover:text-white">
          Sign out
        </button>
      </div>
    );
  }

  if (user?.isAnonymous) {
    return (
      <div className="flex flex-col gap-2 text-xs">
        <p className="text-gray-500">Anonymous</p>
        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-blue-400 hover:text-blue-300"
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
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
            className="flex flex-col gap-2"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
              className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white"
            />
            {error && <p className="text-red-400">{error}</p>}
            <button
              type="submit"
              className="rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
            >
              Create account
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
            className="flex flex-col gap-2"
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-white"
            />
            {error && <p className="text-red-400">{error}</p>}
            <button
              type="submit"
              className="rounded bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
            >
              Sign in
            </button>
          </form>
        )}
      </div>
    );
  }

  return null;
}
