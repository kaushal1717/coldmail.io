import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/get-server-session";
import { transformEmailBody } from "@/lib/transform-email-body";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { to, subject, body } = await req.json();

  // 1. Get the user's Google account tokens from your DB
  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "google",
    },
  });

  if (!account?.accessToken) {
    return NextResponse.json(
      { error: "No Google account linked" },
      { status: 400 }
    );
  }

  // 2. Set up OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oAuth2Client.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
  });

  // 3. Prepare the email
  const htmlBody = transformEmailBody(body);
  const messageParts = [
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    htmlBody,
  ];
  const message = messageParts.join("\n");
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // 4. Send the email
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  return NextResponse.json({ success: true });
}
