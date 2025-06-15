import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Coldmail.io OG Image";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background:
            "radial-gradient(circle, rgba(12,9,84,1) 0%, rgba(5,9,17,1) 100%, rgba(162,33,242,1) 100%, rgba(248,0,255,1) 100%)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="150"
          height="150"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-mailbox"
        >
          <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
          <polyline points="15,9 18,9 18,11" />
          <path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2" />
          <line x1="6" x2="7" y1="10" y2="10" />
        </svg>
        <h1
          style={{
            fontSize: "90",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Coldmail.io
        </h1>
      </div>
    ),
    {
      ...size,
    }
  );
}
