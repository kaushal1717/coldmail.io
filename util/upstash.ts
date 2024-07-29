import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_URI,
  token: process.env.UPSTASH_TOKEN,
});
