// TODO this file does not work!! needs fixing
// TODO comment out when deploying to Vercel
// import { STRAPI_URL, STRAPI_API_TOKEN } from "astro:env/server";

export default async function fetchApi<T>({
  endpoint,
  method = "GET",
  query,
  body,
  wrappedByKey,
  wrappedByList,
  authToken,
}: FetchAPIProps): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  //   const url = new URL(`${STRAPI_URL}/api/${endpoint}`);
  const url = new URL("http://thisisnottobeused.com");

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  //   if (authToken || STRAPI_API_TOKEN) {
  //     headers.Authorization = `Bearer ${authToken || STRAPI_API_TOKEN}`;
  //   }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Fetch failed");
  }

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}
