import {
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "astro:env/server";
import type { StorageValue } from "unstorage";
import { createStorage } from "unstorage";
import upstashDriver from "unstorage/drivers/upstash";

const storage =
  UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
    ? createStorage({
        driver: upstashDriver({
          base: "efa",
          url: UPSTASH_REDIS_REST_URL,
          token: UPSTASH_REDIS_REST_TOKEN,
        }),
      })
    : null;

export async function getCachedNumber(key: string): Promise<number | null> {
  if (!storage) {
    return null;
  }

  try {
    const value = await storage.getItem(key);

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsedValue = Number(value);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  } catch (error) {
    console.error("Failed to read value from Upstash cache", {
      key,
      error,
    });
  }

  return null;
}

export async function getCachedJson<T>(key: string): Promise<T | null> {
  if (!storage) {
    return null;
  }

  try {
    const value = await storage.getItem<T>(key);

    return value ?? null;
  } catch (error) {
    console.error("Failed to read JSON value from Upstash cache", {
      key,
      error,
    });
  }

  return null;
}

export async function setCachedNumber(
  key: string,
  value: number,
  ttlSeconds: number,
) {
  if (!storage) {
    return;
  }

  try {
    await storage.setItem(key, value, { ttl: ttlSeconds });
  } catch (error) {
    console.error("Failed to write value to Upstash cache", {
      key,
      error,
    });
  }
}

export async function setCachedJson(
  key: string,
  value: StorageValue,
  ttlSeconds: number,
) {
  if (!storage) {
    return;
  }

  try {
    await storage.setItem(key, value, { ttl: ttlSeconds });
  } catch (error) {
    console.error("Failed to write JSON value to Upstash cache", {
      key,
      error,
    });
  }
}

export async function deleteCachedItem(key: string) {
  if (!storage) {
    return;
  }

  try {
    await storage.removeItem(key);
  } catch (error) {
    console.error("Failed to delete value from Upstash cache", {
      key,
      error,
    });
  }
}
