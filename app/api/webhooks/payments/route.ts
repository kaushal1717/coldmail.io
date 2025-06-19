import { NextRequest } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const signature = req.headers.get("x-razorpay-signature");
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  if (
    event.event === "payment.authorized" ||
    event.event === "payment.captured"
  ) {
    // Handle successful payment
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.fetch(orderId);
    const metadata = order.notes;

    if (!metadata?.userId || !metadata?.plan) {
      return new Response("Invalid user ID or plan", { status: 400 });
    }

    await prisma.user.update({
      where: { id: metadata?.userId as string },
      data: { subscription: metadata.plan as string },
    });
    return new Response("OK");
  } else if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const order = await razorpay.orders.fetch(orderId);
    const metadata = order.notes;

    console.log("Payment failed:", payment);
    console.log("Order metadata:", metadata);
  }

  return new Response("OK");
}
