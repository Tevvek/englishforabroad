export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Clear the token cookie
  cookies.delete("english-for-abroad-token", { path: "/" });

  // Redirect to the login page (or home)
  return redirect("/login");
};
