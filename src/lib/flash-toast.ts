import type { AstroCookies } from "astro";

const FLASH_TOAST_COOKIE = "flash_toast";

export type FlashToastType = "success" | "error" | "info" | "warning";

export interface FlashToast {
  id: string;
  type: FlashToastType;
  title: string;
  description?: string;
}

interface SetFlashToastInput {
  id?: string;
  type: FlashToastType;
  title: string;
  description?: string;
}

export function setFlashToast(cookies: AstroCookies, input: SetFlashToastInput) {
  const toast: FlashToast = {
    id: input.id ?? crypto.randomUUID(),
    type: input.type,
    title: input.title,
    description: input.description,
  };

  cookies.set(FLASH_TOAST_COOKIE, JSON.stringify(toast), {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });
}

export function consumeFlashToast(cookies: AstroCookies): FlashToast | null {
  const rawCookie = cookies.get(FLASH_TOAST_COOKIE)?.value;

  cookies.delete(FLASH_TOAST_COOKIE, { path: "/" });

  if (!rawCookie) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawCookie) as Partial<FlashToast>;

    if (
      typeof parsed.id !== "string" ||
      typeof parsed.title !== "string" ||
      (parsed.type !== "success" &&
        parsed.type !== "error" &&
        parsed.type !== "info" &&
        parsed.type !== "warning")
    ) {
      return null;
    }

    if (parsed.description && typeof parsed.description !== "string") {
      return null;
    }

    return {
      id: parsed.id,
      type: parsed.type,
      title: parsed.title,
      description: parsed.description,
    };
  } catch {
    return null;
  }
}
