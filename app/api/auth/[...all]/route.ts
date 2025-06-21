import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

const authHandlers = toNextJsHandler(auth);

export const { GET, POST } = authHandlers;
