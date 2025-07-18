/**
 * An array of routes that are accessible to the public.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/terms",
  "/pricing",
  "/about",
  "/contact",
];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged-in users to the dashboard.
 * @type {string[]}
 */
export const authRoutes = ["/sign-in", "/sign-up"];

/**
 * An array of routes that are protected and require authentication.
 * @type {string[]}
 */
export const protectedRoutes = ["/dashboard", "/profile", "/settings"];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after a user logs in.
 * @type {string}
 */
export const DEFAULT_REDIRECT = "/";
