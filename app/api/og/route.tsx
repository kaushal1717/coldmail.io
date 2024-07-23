import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";
import { handleGetWithUniqueId } from "@/actions/actions";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing id parameter", { status: 400 });
  }

  const email = await handleGetWithUniqueId(id);

  if (!email) {
    return new NextResponse("Email template not found", { status: 404 });
  }

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
          backgroundColor: "#030917",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div tw="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span tw="ml-4 text-white">Coldmail.io</span>
        </div>
        <div tw="mt-10 text-5xl text-white text-center">{email.subject}</div>
        <div tw="mt-5 text-2xl text-gray-300">{email.category}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
