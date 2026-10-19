import { ImageResponse } from "next/og";

// Preview card shown when socialspark.usekima.com is shared on social media or in chat apps.
export const alt = "SocialSpark: turn a listing link into ready-to-publish social posts for Canadian realtors";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0f2a44", color: "#ffffff" }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
          Social<span style={{ color: "#d4a24c" }}>Spark</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.1, letterSpacing: -1.5 }}>Turn a listing link into ready-to-publish social posts.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.75)" }}>
            Instagram, Facebook &amp; LinkedIn posts in your voice
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#d4a24c", letterSpacing: 4 }}>FOR CANADIAN REALTORS</div>
      </div>
    ),
    size,
  );
}
