import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const day = url.searchParams.get("day");
  const timezone = url.searchParams.get("timezone");

  return new Response(
    JSON.stringify({
      day,
      timezone,
    }),
    { status: 200 }
  );
};
