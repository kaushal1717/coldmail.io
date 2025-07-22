import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/gmail.send",
      ],
    },
  },
  plugins: [nextCookies()],
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
});
