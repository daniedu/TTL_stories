import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import { getStory } from "@/lib/stories";

export const runtime = "edge";

export default async function handler(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/")[2];

  try {
    const story = await getStory(id);
    if (!story) return fallback();

    const expired = story.expiresAt.seconds * 1000 <= Date.now();

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #030712 0%, #111827 100%)",
            color: "white",
            padding: 60,
          }}
        >
          {expired ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 36,
                color: "#6b7280",
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 20 }}>⏳</div>
              <div>Story Expired</div>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 40,
                  fontSize: 20,
                  color: "#60a5fa",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                TTL Stories
              </div>

              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 20px",
                }}
              >
                <p
                  style={{
                    fontSize: 42,
                    lineHeight: 1.3,
                    margin: 0,
                    color: "#f3f4f6",
                    fontWeight: 600,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {story.content}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginTop: 40,
                    fontSize: 22,
                    color: "#9ca3af",
                  }}
                >
                  <span>{story.authorName || "Anonymous"}</span>
                  <span style={{ color: "#4b5563" }}>·</span>
                  <span>
                    Expires{" "}
                    {Math.floor(
                      (story.expiresAt.seconds * 1000 - Date.now()) / 1000 / 60,
                    ) > 60
                      ? `${Math.floor(
                          (story.expiresAt.seconds * 1000 - Date.now()) /
                            1000 /
                            60 /
                            60,
                        )}h`
                      : `${Math.floor(
                          (story.expiresAt.seconds * 1000 - Date.now()) /
                            1000 /
                            60,
                        )}m`}
                  </span>
                  <span style={{ color: "#374151" }}>·</span>
                  <span
                    style={{
                      color: story.visibility === "public" ? "#34d399" : "#f59e0b",
                    }}
                  >
                    {story.visibility}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      ),
      { width: 1200, height: 630 },
    );
  } catch {
    return fallback();
  }
}

function fallback() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #030712 0%, #111827 100%)",
          color: "white",
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 24 }}>🗺️</div>
        <div style={{ color: "#60a5fa", marginBottom: 8 }}>TTL Stories</div>
        <div style={{ fontSize: 24, color: "#6b7280", fontWeight: 400 }}>
          Ephemeral location-based stories
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
