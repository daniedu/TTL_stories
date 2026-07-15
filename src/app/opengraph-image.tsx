import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export default async function handler() {
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
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 28 }}>🗺️</div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#60a5fa",
            marginBottom: 12,
          }}
        >
          TTL Stories
        </div>
        <div style={{ fontSize: 26, color: "#9ca3af" }}>
          Ephemeral location-based stories
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
            fontSize: 18,
            color: "#6b7280",
          }}
        >
          <span>📍 Location-based</span>
          <span>⏳ 24h TTL</span>
          <span>🔗 Shareable links</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
