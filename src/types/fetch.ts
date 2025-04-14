interface FetchAPIProps {
  endpoint: string;
  method?: "GET" | "POST" | "DELETE";
  query?: Record<string, string>;
  body?: Record<string, unknown>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
  authToken?: string;
}
