interface Props {
  endpoint: string;
  method?: "GET" | "POST" | "DELETE";
  query?: Record<string, string>;
  body?: Record<string, unknown>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
  authToken?: string;
}

export default async function fetchApi<T>({
  endpoint,
  method = "GET",
  query,
  body,
  wrappedByKey,
  wrappedByList,
  authToken,
}: Props): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken || import.meta.env.STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${
      authToken || import.meta.env.STRAPI_API_TOKEN
    }`;
  }

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
