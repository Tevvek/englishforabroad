/**
 * Simple form response utilities
 */

import { ActionError } from "astro:actions";

export function redirect({ message, to }: { message: string; to?: string }) {
  return {
    success: true,
    message,
    to,
  };
}

export function fail({
  message,
  code,
}: {
  message: string;
  code?: ActionError["code"];
}) {
  return new ActionError({
    code: code ?? "BAD_REQUEST",
    message,
  });
}
