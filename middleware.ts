export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/templates", "/templates/new", "/success", "/failure"],
};
