import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return NextResponse.json({ subscription: user?.subscription });
}
