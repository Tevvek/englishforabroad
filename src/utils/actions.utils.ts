/**
 * Action response utilities and type checkers
 */

import { ActionError } from "astro:actions";

export function redirect({ 
  message, 
  to, 
  type = "success" 
}: { 
  message?: string; 
  to: string; 
  type?: "success" | "error" | "info"; 
}) {
  let redirectUrl = to;
  
  if (message) {
    const params = new URLSearchParams();
    params.set("message", message);
    params.set("type", type);
    redirectUrl = `${to}?${params.toString()}`;
  }
  
  return {
    success: true,
    message: message || "",
    to: redirectUrl,
  };
}

export function fail({
  message,
  code,
}: {
  message: string;
  code?: ActionError["code"];
}) {
  throw new ActionError({
    code: code ?? "BAD_REQUEST",
    message,
  });
}

// Type definitions for response types
export type SuccessResponse = {
  success: true;
  message: string;
  to?: string;
};

export type ErrorResponse = {
  success: false;
  message: string;
  code?: ActionError["code"];
};

export type ActionResponse = SuccessResponse | ErrorResponse;

export function isRedirect(
  response: ActionResponse
): response is SuccessResponse & { to: string } {
  return response.success === true && typeof response.to === "string";
}
